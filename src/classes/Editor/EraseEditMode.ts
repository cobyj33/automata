import { PointerEvent } from "react";
import { LineSegment } from "../Data/LineSegment";
import { EditMode } from "./EditMode";

export class EraseEditMode extends EditMode {
    cursor() { return 'url("https://img.icons8.com/material-rounded/24/00000/eraser.png"), crosshair' }
    
    onPointerDown(event: PointerEvent<Element>) {
        const [board, setBoard] = this.data.boardData;
        const hoveredCell = this.data.getHoveredCell(event);
        // if (this.data.isPointerDown) {
        //     // if (map.inBounds(hoveredCell.row, hoveredCell.col)) {
        //     //     setMap((map) => map.placeTile(this.data.selectedTile.clone(), hoveredCell.row, hoveredCell.col))
        //     // }
        // }
        setBoard(board => board.filter(cell => !cell.equals(hoveredCell)));
    }

    onPointerMove(event: PointerEvent<Element>) {
        const [board, setBoard] = this.data.boardData;
        const hoveredCell = this.data.getHoveredCell(event);
        const lastHoveredCell = this.data.lastHoveredCell;
        if (this.data.isPointerDown) {
            // new LineSegment(lastHoveredCell, hoveredCell).toCells().forEach(cell => {
            // if (map.inBounds(cell.row, cell.col)) {
            //     setMap((map) => map.placeTile(this.data.selectedTile.clone(), cell.row, cell.col))
            // }});
            const newCells = new LineSegment(lastHoveredCell, hoveredCell).toCells();
            setBoard(board => board.filter(cell => !newCells.some(newCell => newCell.equals(cell))));

            // setBoard(board => board.concat(new LineSegment(lastHoveredCell, hoveredCell).toCells()))
        }
    }

}