import { PointerEvent, KeyboardEvent } from "react";
import { removeDuplicates } from "functions/utilityFunctions";
import { Vector2 } from "interfaces/Vector2";
import { getEllipse } from "functions/shapes";
import { EditMode } from "classes/Editor/EditModes/EditMode";
import { StatefulData } from "interfaces/StatefulData";

export interface EllipseData {
    boardData: StatefulData<Vector2[]>,
    ghostTilePositions: StatefulData<Vector2[]>,
    getHoveredCell: (event: PointerEvent<Element>) => Vector2,
    isPointerDown: boolean,
        isRendering: boolean;
}

export class EllipseEditMode extends EditMode<EllipseData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }
    start: Vector2 | undefined;
    end: Vector2 | undefined;
    circleLocked: boolean = false;

    get currentCells(): Vector2[] {
        if (this.start !== undefined && this.start !== null && this.end !== undefined && this.end !== null) {
            return getEllipse(this.start, this.end);
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
        this.end = { ...this.start };
    }

    onPointerMove(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            this.start = undefined;
            this.end = undefined;
            return;
        }

        if (this.data.isPointerDown && this.start !== undefined && this.start !== null && this.end !== undefined && this.end !== null) {
            const hoveredCell = this.data.getHoveredCell(event);
            if (!(this.end.row === hoveredCell.row && this.end.col === hoveredCell.col)) {
                const toRemove = new Set<string>(this.currentCells.map(cell => JSON.stringify(cell)));
                const [, setGhostTilePositions] = this.data.ghostTilePositions;
                setGhostTilePositions( positions => positions.filter( cell => !toRemove.has(JSON.stringify(cell)) ) )
                
                if (this.circleLocked) {
                    const sideLength: number = Math.min(Math.abs(hoveredCell.row - this.start.row), Math.abs(hoveredCell.col - this.start.col));

                    this.end = {
                        row: this.start.row + ( hoveredCell.row < this.start.row ? -sideLength : sideLength ),
                        col: this.start.col + ( hoveredCell.col < this.start.col ? -sideLength : sideLength )       
                    }

                    // this.end = this.start.add( new Vector2( hoveredCell.row < this.start.row ? -sideLength : sideLength, hoveredCell.col < this.start.col ? -sideLength : sideLength ) )
                } else {
                    this.end = hoveredCell;
                }

                setGhostTilePositions( positions => positions.concat( this.currentCells ) )
            }
        }
    }

    onPointerUp() {
        if (this.data.isRendering) {
            this.start = undefined;
            this.end = undefined;
            return;
        }

        if (this.start !== undefined && this.end !== undefined) {
            const [, setBoard] = this.data.boardData;
            setBoard(board => removeDuplicates(board.concat(this.currentCells)));
            const [, setGhostTilePositions] = this.data.ghostTilePositions;
            const toRemove = new Set<string>(this.currentCells.map(cell => JSON.stringify(cell)));
            setGhostTilePositions( positions => positions.filter( cell =>  !toRemove.has(JSON.stringify(cell)) ) )
        }
        this.start = undefined;
        this.end = undefined;
        this.circleLocked = false;
    }

    onKeyDown(event: KeyboardEvent<Element>) {
        if (event.code === "ShiftLeft") {
            this.circleLocked = true;
        }
    }

    onKeyUp(event: KeyboardEvent<Element>) {
        if (event.code === "ShiftLeft") {
            this.circleLocked = false;
        }
    }
}

export default EllipseEditMode
