import { KeyboardEvent, PointerEvent } from "react";
import {getLine} from "functions/shapes";
import { IVector2, filterVector2ListDuplicates } from "interfaces/Vector2";
import { StatefulData } from "interfaces/StatefulData";
import { EditMode } from "classes/Editor/EditModes/EditMode";
import { LifeLikeEditorData } from "interfaces/EditorData";

type LineSegment = {
    first: IVector2,
    second: IVector2
}

export class BoxEditMode extends EditMode<LifeLikeEditorData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }
    start: IVector2 | undefined;
    end: IVector2 | undefined;
    boxLocked: boolean = false;
    private get currentBox(): LineSegment[] {
        if (this.start !== undefined && this.end !== undefined) {
            return this.box(this.start, this.end);
        }
        return []
    };

    private get boxCells(): IVector2[] { return filterVector2ListDuplicates(this.currentBox.flatMap(line => getLine(line.first, line.second))) ?? [] }

    onPointerDown(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            this.start = undefined;
            this.end = undefined;
            return;
        }

        this.start = this.data.currentHoveredCell;
        this.end = {...this.start };
    }

    onPointerMove(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            this.start = undefined;
            this.end = undefined;
            return;
        }

        if (this.data.isPointerDown && this.start !== undefined && this.end !== undefined) {
            const hoveredCell = this.data.currentHoveredCell;
            if (!( this.end.row === hoveredCell.row && this.end.col === hoveredCell.col  )) {
                const toRemove = new Set<string>(this.boxCells.map(cell => JSON.stringify(cell)));
                const setGhostTilePositions = this.data.ghostTilePositions[1];
                setGhostTilePositions( positions => positions.filter( cell => !toRemove.has(JSON.stringify(cell)) ) )

                if (this.boxLocked) {
                    const sideLength: number = Math.min(Math.abs(hoveredCell.row - this.start.row), Math.abs(hoveredCell.col - this.start.col));

                    this.end = {
                        row: this.start.row + ( hoveredCell.row < this.start.row ? -sideLength : sideLength ),
                        col: this.start.col + ( hoveredCell.col < this.start.col ? -sideLength : sideLength )       
                    }
                    // this.end = this.start.add( new IVector2( hoveredCell.row < this.start.row ? -sideLength : sideLength, hoveredCell.col < this.start.col ? -sideLength : sideLength ) )
                } else {
                    this.end = hoveredCell;
                }

                setGhostTilePositions( positions => positions.concat( this.boxCells ) )
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
            const setBoard = this.data.boardData[1];
            const setGhostTilePositions = this.data.ghostTilePositions[1];

            setBoard(board => filterVector2ListDuplicates(board.concat(this.boxCells)))
            const toRemove = new Set<string>(this.boxCells.map(cell => JSON.stringify(cell)));
            setGhostTilePositions( positions => positions.filter( cell =>  !toRemove.has(JSON.stringify(cell)) ) )
        }

        this.start = undefined;
        this.end = undefined;
        this.boxLocked = false;
    }

    box(start: IVector2, end: IVector2): LineSegment[] {
        const firstCorner = { row: start.row, col: end.col }
        const secondCorner = {row: end.row, col: start.col }
        return [
            {first: start, second: firstCorner },
            {first: firstCorner, second: end },
            {first: end, second: secondCorner },
            {first: secondCorner, second: start }
        ];
    }

    onKeyDown(event: KeyboardEvent<Element>) {
        if (event.code === "ShiftLeft") {
            this.boxLocked = true;
        }
    }

    onKeyUp(event: KeyboardEvent<Element>) {
        if (event.code === "ShiftLeft") {
            this.boxLocked = false;
        }
    }
}

export default BoxEditMode