import {Box} from "interfaces/Box";
import { Dimension } from "./Dimension";
import { Vector2 } from "./Vector2";

export interface CellMatrix extends Box {
    matrix: Uint8ClampedArray;
}

export class CellMatrixClass {

    readonly matrix: Uint8ClampedArray
    readonly position: Vector2
    readonly dimensions: Dimension

    constructor(matrix: Uint8ClampedArray, position: Vector2, dimensions: Dimension) {
        this.matrix = matrix;
        this.position = position
        this.dimensions = dimensions
    }
}

