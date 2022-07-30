export interface Box {
    row: number;
    col: number;
    width: number;
    height: number;
}

type Position = { row: number, col: number }

export function inBox(inside: Position, outside: Box): boolean {
    return inside.row >= outside.row && inside.row <= outside.row + outside.height && inside.col >= outside.col && inside.col <= outside.col + outside.width;
}