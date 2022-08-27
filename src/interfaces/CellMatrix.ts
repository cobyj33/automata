import {Box} from "./Box";

export interface CellMatrix extends Box {
    matrix: Uint8ClampedArray;
}

