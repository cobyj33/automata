import { Box } from "../../interfaces/Box";

export class Dimension {
    readonly rows: number;
    readonly cols: number;

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
    }

    toBox(): Box {
        return { 
            row: 0,
            col: 0,
            width: this.cols,
            height: this.rows
        }
    }
}