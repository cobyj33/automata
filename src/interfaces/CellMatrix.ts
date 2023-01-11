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

    static fromNumberMatrix(matrix: number[][], position: Vector2): CellMatrix {
        if (isRectangularMatrix(matrix)) {
            return new CellMatrix(new Uint8ClampedArray(matrix.flat()), new Box(position, new Dimension2D(matrix[0].length, matrix.length)))
        }
        throw new Error("Matrix " + matrix + " is not a rectangular matrix, cannot create a CellMatrix")
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

