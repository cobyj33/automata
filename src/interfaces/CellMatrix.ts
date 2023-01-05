import { isRectangularMatrix } from "functions/validation";
import {Box} from "interfaces/Box";
import { Dimension2D } from "./Dimension";
import { IVector2, Vector2 } from "./Vector2";


export interface CellMatrix extends Box {
    matrix: Uint8ClampedArray;
}


// export class CellMatrix {
//     readonly cellData: Uint8ClampedArray
//     readonly box: Box

//     constructor(cellData: Uint8ClampedArray, box: Box) {
//         this.cellData = cellData;
//         this.box = box
//     }

//     static fromNumberMatrix(matrix: number[][], position: Vector2): CellMatrix {
//         if (isRectangularMatrix(matrix)) {
//             return new CellMatrix(new Uint8ClampedArray(matrix.flat()), new Box(position, new Dimension2D(matrix[0].length, matrix.length)))
//         }
//         throw new Error("Matrix " + matrix + " is not a rectangular matrix, cannot create a CellMatrix")
//     }

//     add(row: number, col: number) {
//     }

//     addVec2(vec: IVector2) {
//     }

//     combine(other: CellMatrix) {
//     }


// }

