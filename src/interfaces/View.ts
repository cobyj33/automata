import { Vector2 } from "./Vector2";

export interface View {
    readonly coordinates: Vector2;
    readonly cellSize: number;
}

export function getViewOffset(view: View): Vector2 {
    return { row:  view.coordinates.row * view.cellSize % view.cellSize, col: view.coordinates.col * view.cellSize % view.cellSize};
}
