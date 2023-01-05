import { IVector2 } from "interfaces/Vector2";
import { Box } from "./Box";


export class LifeLikeBoard {
    cells: IVector2[] = []
    bounds: Box | null = null

    constructor(cells: IVector2[]) {
        this.cells = cells
    }

    setBox(bounds: Box): LifeLikeBoard {
        this.bounds = bounds;
        return this;
    }
}
