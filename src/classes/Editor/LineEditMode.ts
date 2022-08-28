import { PointerEvent } from "react";
import { removeDuplicates } from "../../functions/utilityFunctions";
import { Vector2 } from "../../interfaces/Vector2";
import { EditMode } from "./EditMode";
import {getLine} from '../../functions/shapes';
import {StatefulData} from "../../interfaces/StatefulData";
import { Box } from "../../interfaces/Box";

export interface LineData {
    boardData: StatefulData<Vector2[]>,
    boundsData: StatefulData<Box>,
    ghostTilePositions: StatefulData<Vector2[]>,
    getHoveredCell: (event: PointerEvent<Element>) => Vector2,
    isPointerDown: boolean,
        isRendering: boolean;
}

export class LineEditMode extends EditMode<LineData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }
    start: Vector2 | undefined;
    end: Vector2 | undefined;
    get cells(): Vector2[] {
        if (this.start !== undefined && this.end !== undefined) {
            return getLine(this.start, this.end); 
        }
        return []
    }

    onPointerDown(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            this.start = undefined;
            this.end = undefined;
            return;
        }

        this.start = this.data.getHoveredCell(event);
        this.end = { ...this.start }
    }

    onPointerMove(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            this.start = undefined;
            this.end = undefined;
            return;
        }

        if (this.data.isPointerDown && this.start !== undefined && this.end !== undefined) {
            const hoveredCell = this.data.getHoveredCell(event);
            if (!(this.end.row === hoveredCell.row && this.end.col === hoveredCell.col)) {
                const toRemove = new Set<string>(this.cells.map(cell => JSON.stringify(cell)));
                const [, setGhostTilePositions] = this.data.ghostTilePositions;
                setGhostTilePositions( positions => positions.filter( cell => !toRemove.has(JSON.stringify(cell)) ) )
                this.end = hoveredCell;
                setGhostTilePositions( positions => positions.concat( this.cells ) )
            }
        }
    }

    onPointerUp(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            this.start = undefined;
            this.end = undefined;
            return;
        }

        if (this.start !== undefined && this.end !== undefined) {
            const [, setBoard] = this.data.boardData;
            const [bounds] = this.data.boundsData;
            const newCells: Vector2[] = getLine(this.start, this.end).filter(cell => cell.row >= bounds.row && cell.col >= bounds.col && cell.row < bounds.row + bounds.height && cell.col < bounds.col + bounds.width);

            setBoard(board =>  removeDuplicates(board.concat(newCells)))
            const [, setGhostTilePositions] = this.data.ghostTilePositions;
            const toRemove = new Set<string>(newCells.map(cell => JSON.stringify(cell)));
            setGhostTilePositions( positions => positions.filter( cell =>  !toRemove.has(JSON.stringify(cell)) ) )
        }

        this.start = undefined;
        this.end = undefined
    }

}
