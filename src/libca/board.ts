import { IVector2 } from "common/Vector2";
import { Box } from "common/Box";
import { CellMatrix } from "common/CellMatrix";


export class CellBoard {
    readonly cells: CellMatrix[] = []

    constructor(cells: CellMatrix[]) {
        this.cells = cells
    }

    private reconstruct() {
        
    }
}

export class BoundedCellBoard {

}