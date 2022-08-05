import { PointerEvent } from "react";
import { removeDuplicates } from "../../../functions/utilityFunctions";
import { Vector2 } from "../../../interfaces/Vector2";
import { EditMode } from "../EditMode";
import {getLine} from '../../../functions/shapes';
import { StatefulData } from "../../../interfaces/StatefulData"
import { CellMatrix } from "../../../interfaces/CellMatrix"

interface LineData {
    boardData: StatefulData<CellMatrix>,
    ghostTilePositions: StatefulData<number[]>,
    getHoveredCell: (event: PointerEvent<Element>) => number,
    isPointerDown: boolean,
}

function range(first: number, second: number): number[] {
    const min: number = Math.min(first, second);
    const distance: number = Math.abs(first - second);
    return Array.from({length: distance}, (val, index) => index + min);
}

export class ElementaryLineEditMode extends EditMode<LineData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }
    start: number | undefined;
    end: number | undefined;

    onPointerDown(event: PointerEvent<Element>) {
        this.start = this.data.getHoveredCell(event);
        this.end = this.start;
    }

    onPointerMove(event: PointerEvent<Element>) {
        if (this.data.isPointerDown && this.start !== undefined && this.start !== null && this.end !== undefined && this.end !== null) {
            const hoveredCell = this.data.getHoveredCell(event);
            if (!(this.end === hoveredCell)) {
                const toRemove = new Set<number>(range(this.start, this.end));
                const [, setGhostTilePositions] = this.data.ghostTilePositions;
                setGhostTilePositions( positions => positions.filter( col => !toRemove.has( col ) ))
                this.end = hoveredCell;
                setGhostTilePositions( positions => positions.concat( range(this.start, this.end) ) )
            }
        }
    }

    onPointerUp(event: PointerEvent<Element>) {
        if (this.start !== undefined && this.end !== undefined && this.start !== null && this.end !== null) {
            const [, setBoard] = this.data.boardData;
            const newCells: Vector2[] = getLine(this.start, this.end); 
            setBoard(cellMatrix => {
                const line: number[] = range(this.start, this.end);
                line.forEach(num => cellMatrix.matrix[num] = 0);
            })
            const toRemove = new Set<number>(range(this.start, this.end));
            const [, setGhostTilePositions] = this.data.ghostTilePositions;
            setGhostTilePositions( positions => positions.filter( col => !toRemove.has( col ) ))
        }

        this.start = undefined;
        this.end = undefined
    }

}
