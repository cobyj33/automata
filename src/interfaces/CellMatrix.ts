import { Vector2 } from "./Vector2";
import {Box, getEnclosingBox} from "./Box";

export interface CellMatrix {
    topLeft: Vector2;
    matrix: number[];
    width: number;
    height: number;
}

