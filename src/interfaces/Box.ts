import { Vector2 } from "./Vector2";

export interface Box extends Vector2 {
    width: number;
    height: number;
}

export function inBox(inside: Vector2, outside: Box): boolean {
    return inside.row >= outside.row && inside.row <= outside.row + outside.height && inside.col >= outside.col && inside.col <= outside.col + outside.width;
}

export function getEnclosingBox(cells: Vector2[]): Box {
    if (cells.length === 0) {
        return {
            row: 0,
            col: 0,
            width: 0,
            height: 0,
        }
    }

    let minRow = cells[0].row;
    let maxRow = cells[0].row;
    let minCol = cells[0].col;
    let maxCol = cells[0].col;

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].row < minRow) {
            minRow = cells[i].row;
        }
        if (cells[i].col < minCol) {
            minCol = cells[i].col;
        }
        if (cells[i].row > maxRow) {
            maxRow = cells[i].row;
        }
        if (cells[i].col > maxCol) {
            maxCol = cells[i].col;
        }
    }

    return {
        row: minRow,
        col: minCol,
        width: Math.abs(maxCol - minCol),
        height: Math.abs(maxRow - minRow)
    }
}
