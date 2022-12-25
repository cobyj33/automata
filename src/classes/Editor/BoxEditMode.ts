import { KeyboardEvent, PointerEvent } from "react";
import {getLine} from "../../functions/shapes";
import { removeDuplicates } from "../../functions/utilityFunctions"
import { Vector2 } from "../../interfaces/Vector2";
import { StatefulData } from "../../interfaces/StatefulData";
import { EditMode } from "./EditMode";

type LineSegment = {
    first: Vector2,
    second: Vector2
}

export interface BoxData {
    boardData: StatefulData<Vector2[]>,
    ghostTilePositions: StatefulData<Vector2[]>,
    getHoveredCell: (event: PointerEvent<Element>) => Vector2,
    isPointerDown: boolean,
        isRendering: boolean;
}

export class BoxEditMode extends EditMode<BoxData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }
    start: Vector2 | undefined;
    end: Vector2 | undefined;
    boxLocked: boolean = false;
    private get currentBox(): LineSegment[] {
        if (this.start !== undefined && this.end !== undefined) {
            return this.box(this.start, this.end);
        }
        return []
    };

    private get boxCells(): Vector2[] { return removeDuplicates(this.currentBox.flatMap(line => getLine(line.first, line.second))) ?? [] }

    onPointerDown(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            this.start = undefined;
            this.end = undefined;
            return;
        }

        this.start = this.data.getHoveredCell(event);
        this.end = {...this.start };
    }

    onPointerMove(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            this.start = undefined;
            this.end = undefined;
            return;
        }

        if (this.data.isPointerDown && this.start !== undefined && this.end !== undefined) {
            const hoveredCell = this.data.getHoveredCell(event);
            if (!( this.end.row === hoveredCell.row && this.end.col === hoveredCell.col  )) {
                const toRemove = new Set<string>(this.boxCells.map(cell => JSON.stringify(cell)));
                const { 1: setGhostTilePositions } = this.data.ghostTilePositions;
                setGhostTilePositions( positions => positions.filter( cell => !toRemove.has(JSON.stringify(cell)) ) )

                if (this.boxLocked) {
                    const sideLength: number = Math.min(Math.abs(hoveredCell.row - this.start.row), Math.abs(hoveredCell.col - this.start.col));

                    this.end = {
                        row: this.start.row + ( hoveredCell.row < this.start.row ? -sideLength : sideLength ),
                        col: this.start.col + ( hoveredCell.col < this.start.col ? -sideLength : sideLength )       
                    }
                    // this.end = this.start.add( new Vector2( hoveredCell.row < this.start.row ? -sideLength : sideLength, hoveredCell.col < this.start.col ? -sideLength : sideLength ) )
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

        console.log(this.start, this.end);
        if (this.start !== undefined && this.end !== undefined) {
            const { 1: setBoard } = this.data.boardData;
            console.log('box cell count:' + this.boxCells.length);
            // this.boxCells.forEach(cell => {
            //     if (board.inBounds(cell.row, cell.col)) {
            //         setBoard((board) => map.placeTile(this.data.selectedTile.clone(), cell.row, cell.col))
            //     } 
            // })

            setBoard(board => removeDuplicates(board.concat(this.boxCells)))

            const { 1: setGhostTilePositions } = this.data.ghostTilePositions;
            const toRemove = new Set<string>(this.boxCells.map(cell => JSON.stringify(cell)));
            setGhostTilePositions( positions => positions.filter( cell =>  !toRemove.has(JSON.stringify(cell)) ) )
        }

        this.start = undefined;
        this.end = undefined;
        this.boxLocked = false;
    }

    box(start: Vector2, end: Vector2): LineSegment[] {
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
