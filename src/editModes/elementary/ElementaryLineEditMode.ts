import { PointerEvent } from "react";
import { EditMode } from "editModes/EditMode";
import { StatefulData } from "jsutil/react"
import { CellMatrix } from "common/CellMatrix"
import { ElementaryEditorData } from "common/EditorData";
import { clamp } from "jsutil";

function range(first: number, second: number): number[] {
    const min: number = Math.min(first, second);
    const distance: number = Math.abs(first - second);
    return Array.from({length: distance}, (val, index) => index + min);
}

export class ElementaryLineEditMode extends EditMode<ElementaryEditorData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }
    start: number = 0;
    end: number = 0;
    active: boolean = false;

    private startLine(position: number): void {
        this.start = position;
        this.end = position;
        this.active = true;
    }

    private reset(): void {
        this.start = 0;
        this.end = 0;
        this.active = false;
    }

    onPointerDown(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            this.reset();
            return;
        }

        this.startLine(this.data.currentHoveredColumn)
    }

    onPointerMove(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            this.reset();
            return;
        }
        
        if (this.active) {
            if (this.data.currentHoveredColumn < this.start) {
                this.start = clamp(this.data.currentHoveredColumn, 0, this.data.boardData[0].length - 1);
            } else {
                this.end = clamp(this.data.currentHoveredColumn, 0, this.data.boardData[0].length - 1)
            }
    
            const setGhostTilePositions = this.data.ghostTilePositions[1];
            const ghostArray = new Array(this.data.boardData[0].length).fill(0)
            for (let i = this.start; i <= this.end; i++) {
                ghostArray[i] = 1;
            }
            setGhostTilePositions(ghostArray)
        }
    }

    onPointerUp(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            this.reset()
            return;
        }

        if (this.active) {
            const setBoard = this.data.boardData[1];
            const arr = new Array(this.data.boardData[0].length).fill(0)
            setBoard(board => {
                const newBoard = [...board];
                for (let i = this.start; i <= this.end; i++) {
                    newBoard[i] = 1;
                }
                return newBoard;
            })
            this.data.ghostTilePositions[1]([]);
        
            this.reset();
        }
    }
    
    onPointerLeave(event: PointerEvent<Element>): void {
        this.reset();
    }

}


export default ElementaryLineEditMode