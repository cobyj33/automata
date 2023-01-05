import { IVector2 } from "interfaces/Vector2";
import { Box } from "./Box";
import { CellMatrix } from "./CellMatrix";


export class CellBoard {
    readonly cells: CellMatrix[] = []

    constructor(cells: CellMatrix[]) {
        this.cells = cells
    }
}
