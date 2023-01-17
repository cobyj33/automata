import { isRectangularMatrix } from "functions/util";
import {Box, IBox} from "interfaces/Box";
import { Dimension2D, IDimension2D } from "./Dimension";
import { IVector2, Vector2 } from "./Vector2";


// export interface CellMatrix extends Box {
//     matrix: Uint8ClampedArray;
// }


export class CellMatrix {
    readonly cellData: Uint8ClampedArray
    readonly box: Box

    constructor(cellData: Uint8ClampedArray, box: IBox) {
        const boxobj = Box.fromIBox(box)
        if (cellData.length !== boxobj.area) {
            throw new Error("Invalid Cell Data: Must be equal to the area of the box of the matrix")
        }

        this.cellData = cellData;
        this.box = boxobj
    }

    get width() {
        return this.box.width
    }

    get height() {
        return this.box.height
    }

    get row() {
        return this.box.row
    }

    get col() {
        return this.box.col
    }

    get size() {
        return this.box.size
    }

    get area() {
        return this.box.area
    }

    get topleft() {
        return this.box.topleft
    }

    static fromCellNumberMatrix(matrix: number[][], position: Vector2): CellMatrix {
        if (isValidCellNumberMatrix(matrix)) {
            return new CellMatrix(new Uint8ClampedArray(matrix.flat()), new Box(position, new Dimension2D(matrix[0].length, matrix.length)))
        }
        throw new Error(getValidCellNumberMatrixError(matrix))
    }

    static fromNumberMatrix(matrix: number[][], position: Vector2): CellMatrix {
        if (isRectangularMatrix(matrix)) {
            return new CellMatrix(new Uint8ClampedArray(matrix.flat()), new Box(position, new Dimension2D(matrix[0].length, matrix.length)))
        }
        throw new Error("Matrix " + matrix + " is not a rectangular number matrix, cannot create CellMatrix: ")
    }

    withCellData(cellData: Uint8ClampedArray): CellMatrix {
        if (cellData.length !== this.cellData.length) {
            throw new Error("Tried to change cell data on a cell matrix to an invalid array size, must be the same as the size of previous data")
        }
        return new CellMatrix(cellData, this.box)
    }

    static equals(first: CellMatrix, other: CellMatrix): boolean {
        return first.equals(other)
    }

    static fromIVector2List(list: IVector2[]): CellMatrix {
        const boundingBox: Box = Box.enclosed(list).expand(1, 1);
        return CellMatrix.fromBoundedIVector2List(list, boundingBox)
    }

    static fromBoundedIVector2List(list: IVector2[], boundingBox: Box): CellMatrix {
        const matrixData: Uint8ClampedArray = new Uint8ClampedArray(boundingBox.area);
        list.forEach(cell => {
            matrixData[(cell.row - boundingBox.row) * boundingBox.width + (cell.col - boundingBox.col)] = 1
        });
        return new CellMatrix(matrixData, boundingBox)
    }

    toVector2List(): Vector2[] {
        const cells: Vector2[] = [];
        this.forEach((row, col) => {
            if (this.at(row, col) === 1) {
                cells.push(this.topleft.addcomp(row, col));
            }
        })

        return cells;
    }

    at(row: number, col: number) {
        return this.cellData[row * this.box.width + col]
    }

    pointInside(vec: IVector2): boolean {
        return this.box.pointInside(vec)
    }

    forEach(callbackfn: (row: number, col: number) => void) {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                callbackfn(row, col)
            }
        }
    }

    clear(): CellMatrix {
        return CellMatrix.empty(this.box)
    }
     
    static empty(box: IBox) {
        return new CellMatrix(new Uint8ClampedArray(box.size.width * box.size.height), box) 
    }

    add(row: number, col: number) {
    }

    addVec2(vec: IVector2) {
    }

    equals(other: CellMatrix) {
        return this.box.equals(other.box) && this.cellData.every((value, index) => other.cellData[index] === value)
    }

    // combine(other: CellMatrix) {
    // }
}

export function isValidCellNumberMatrix(matrix: number[][]) {
    return getValidCellNumberMatrixError(matrix) === ""
}

export function getValidCellNumberMatrixError(matrix: number[][]): string {
    const errorHeader = "Invalid Cell Number Matrix: "
    if (!isRectangularMatrix(matrix)) {
        return errorHeader + "Cell Number Matrix must be rectangular in dimensions"
    }
    if (matrix.length === 0) {
        return errorHeader + "Invalid Cell Number Matrix: Cell Number Matrix must have a length greater than 1"
    }

    for (let row = 0; row < matrix.length; row++) {
        if (matrix[row][0] !== 0 || matrix[row][matrix[row].length - 1] !== 0) {
            return errorHeader + "Cell Number Matrix must have padded 0's around sides";
        }
    }

    for (let col = 0; col < matrix[0].length; col++) {
        if (matrix[0][col] !== 0 || matrix[matrix.length - 1][col] !== 0) {
            return errorHeader + "Invalid Cell Number Matrix: Cell Number Matrix must have padded 0's around sides";
        }
    }

    return "";
}