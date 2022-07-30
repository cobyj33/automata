import { KeyboardEvent, PointerEvent } from "react";
import { removeDuplicates } from "../../functions/utilityFunctions";
import { Ellipse } from "../Data/Ellipse";
import { Vector2 } from "../Data/Vector2";
import { EditMode } from "./EditMode";

export class EllipseEditMode extends EditMode {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }
    start: Vector2 | undefined;
    end: Vector2 | undefined;
    circleLocked: boolean = false;

    private ellipse: Ellipse = new Ellipse(new Vector2(0, 0), new Vector2(0, 0));
    private get currentCells(): Vector2[] {
        if (this.start !== undefined && this.end !== undefined) {
            if (this.ellipse.start.equals(this.start) && this.ellipse.end.equals(this.end)) {
                return this.ellipse.cells;
            }
            this.ellipse = new Ellipse(this.start, this.end);
            return this.ellipse.cells;
        }
        return []
    };

    onPointerDown(event: PointerEvent<Element>) {
        this.start = this.data.getHoveredCell(event);
        this.end = this.start.clone();
    }

    onPointerMove(event: PointerEvent<Element>) {
        if (this.data.isPointerDown && this.start !== undefined && this.end !== undefined) {
            const hoveredCell = this.data.getHoveredCell(event);
            if (!this.end.equals(hoveredCell)) {
                const toRemove = new Set<string>(this.currentCells.map(cell => JSON.stringify(cell)));
                const [ghostTilePositions, setGhostTilePositions] = this.data.ghostTilePositions;
                setGhostTilePositions( positions => positions.filter( cell => !toRemove.has(JSON.stringify(cell)) ) )
                
                if (this.circleLocked) {
                    const sideLength: number = Math.min(Math.abs(hoveredCell.row - this.start.row), Math.abs(hoveredCell.col - this.start.col));
                    this.end = this.start.add( new Vector2( hoveredCell.row < this.start.row ? -sideLength : sideLength, hoveredCell.col < this.start.col ? -sideLength : sideLength ) )
                } else {
                    this.end = hoveredCell;
                }

                setGhostTilePositions( positions => positions.concat( this.currentCells ) )
            }
        }
    }

    onPointerUp(event: PointerEvent<Element>) {
        console.log(this.start, this.end);
        if (this.start !== undefined && this.end !== undefined) {
            const [board, setBoard] = this.data.boardData;
            setBoard(board => removeDuplicates(board.concat(this.currentCells)));
            const [ghostTilePositions, setGhostTilePositions] = this.data.ghostTilePositions;
            const toRemove = new Set<string>(this.currentCells.map(cell => JSON.stringify(cell)));
            setGhostTilePositions( positions => positions.filter( cell =>  !toRemove.has(JSON.stringify(cell)) ) )
        }
        this.start = undefined;
        this.end = undefined;
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