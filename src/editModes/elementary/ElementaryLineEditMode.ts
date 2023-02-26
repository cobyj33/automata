import { PointerEvent } from "react";
import { EditMode } from "editModes/EditMode";
import { StatefulData } from "common/StatefulData"
import { CellMatrix } from "common/CellMatrix"
import { ElementaryEditorData } from "common/EditorData";

function range(first: number, second: number): number[] {
    const min: number = Math.min(first, second);
    const distance: number = Math.abs(first - second);
    return Array.from({length: distance}, (val, index) => index + min);
}

export class ElementaryLineEditMode extends EditMode<ElementaryEditorData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }
    start: number | undefined;
    end: number | undefined;

    onPointerDown(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            this.start = undefined;
            this.end = undefined;
            return;
        }

        this.start = this.data.currentHoveredColumn;
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
            const hoveredColumn = this.data.currentHoveredColumn;
            if (!(end === hoveredColumn)) {
                const toRemove = new Set<number>(range(start, end));
                const [, setGhostTilePositions] = this.data.ghostTilePositions;
                setGhostTilePositions( positions => positions.filter( col => !toRemove.has( col ) ))
                end = hoveredColumn;
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
            setBoard(board => {
                const newBoard: number[] = [...board];
                line.forEach(num => newBoard[num] = 1);
                return newBoard
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