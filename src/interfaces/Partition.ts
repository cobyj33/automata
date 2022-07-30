import { Vector2 } from "../classes/Data/Vector2";
import { Box } from "./Box";

export interface Partition extends Box {
    cells: Array<Vector2>
}