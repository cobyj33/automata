import { PointerEvent } from "react";
import { EditMode } from "classes/Editor/EditModes/EditMode";
import { StatefulData } from "interfaces/StatefulData"
import { CellMatrix } from "interfaces/CellMatrix"

export interface ElementaryLineData {
    boardData: StatefulData<CellMatrix>,
    ghostTilePositions: StatefulData<number[]>,
    getHoveredCell: (event: PointerEvent<Element>) => number,
    isPointerDown: boolean,
    isRendering: boolean;
}

function range(first: number, second: number): number[] {
    const min: number = Math.min(first, second);
    const distance: number = Math.abs(first - second);
    return Array.from({length: distance}, (val, index) => index + min);
}

export class ElementaryLineEditMode extends EditMode<ElementaryLineData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }
    start: number | undefined;
    end: number | undefined;

    onPointerDown(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            this.start = undefined;
            this.end = undefined;
            return;
        }

        this.start = this.data.getHoveredCell(event);
        this.end = this.start;
    }

    onPointerMove(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            this.start = undefined;
            this.end = undefined;
            return;
        }

        if (this.data.isPointerDown && this.start !== undefined && this.start !== null && this.end !== undefined && this.end !== null) {
            let start = this.start
            let end = this.end;
            const hoveredCell = this.data.getHoveredCell(event);
            if (!(end === hoveredCell)) {
                const toRemove = new Set<number>(range(start, end));
                const [, setGhostTilePositions] = this.data.ghostTilePositions;
                setGhostTilePositions( positions => positions.filter( col => !toRemove.has( col ) ))
                end = hoveredCell;
                setGhostTilePositions( positions => positions.concat( range(start, end) ) )
            }
            this.start = start;
            this.end = end;
        }
    }

    onPointerUp(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            this.start = undefined;
            this.end = undefined;
            return;
        }

        if (this.start !== undefined && this.end !== undefined && this.start !== null && this.end !== null) {
            let start = this.start
            let end = this.end;
            const [, setBoard] = this.data.boardData;
            const line: number[] = range(start, end); 
            setBoard(cellMatrix => {
                const newMatrix: Uint8ClampedArray = new Uint8ClampedArray(cellMatrix.matrix);
                line.forEach(num => newMatrix[num] = 1);
                return {
                    ...cellMatrix,
                    matrix: newMatrix
                }
            })
            const toRemove = new Set<number>(line);
            const [, setGhostTilePositions] = this.data.ghostTilePositions;
            setGhostTilePositions( positions => positions.filter( col => !toRemove.has( col ) ))
        }

        this.start = undefined;
        this.end = undefined
    }

}


export default ElementaryLineEditMode