import { Vector2 } from "interfaces/Vector2";
import { Box } from "./Box";


export class LifeLikeBoard {
    cells: Vector2[] = []
    bounds: Box | null = null

    constructor(cells: Vector2[]) {
        this.cells = cells
    }

    setBox(bounds: Box): LifeLikeBoard {
        this.bounds = bounds;
        return this;
    }
}
