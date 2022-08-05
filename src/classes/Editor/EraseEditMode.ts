import { PointerEvent } from "react";
import { EditMode } from "./EditMode";
import { getLine } from "../../functions/shapes";
import { StatefulData } from "../../interfaces/StatefulData"
import { Vector2 } from "../../interfaces/Vector2"

interface EraseData {
    boardData: StatefulData<Vector2[]>,
    ghostTilePositions: StatefulData<Vector2[]>,
    getHoveredCell: (event: PointerEvent<Element>) => Vector2,
    lastHoveredCell: Vector2,
    isPointerDown: boolean,
}

export class EraseEditMode extends EditMode<EraseData> {
    cursor() { return 'url("https://img.icons8.com/material-rounded/24/00000/eraser.png"), crosshair' }
    
    onPointerDown(event: PointerEvent<Element>) {
        const [, setBoard] = this.data.boardData;
        const hoveredCell = this.data.getHoveredCell(event);
        // if (this.data.isPointerDown) {
        //     // if (map.inBounds(hoveredCell.row, hoveredCell.col)) {
        //     //     setMap((map) => map.placeTile(this.data.selectedTile.clone(), hoveredCell.row, hoveredCell.col))
        //     // }
        // }
        setBoard(board => board.filter(cell => !(cell.row === hoveredCell.row && cell.col === hoveredCell.col)  ));
    }

    onPointerMove(event: PointerEvent<Element>) {
        const [, setBoard] = this.data.boardData;
        const hoveredCell = this.data.getHoveredCell(event);
        const lastHoveredCell = this.data.lastHoveredCell;
        if (this.data.isPointerDown) {
            // new LineSegment(lastHoveredCell, hoveredCell).toCells().forEach(cell => {
            // if (map.inBounds(cell.row, cell.col)) {
            //     setMap((map) => map.placeTile(this.data.selectedTile.clone(), cell.row, cell.col))
            // }});
            const newCells = getLine(lastHoveredCell, hoveredCell) 
            setBoard(board => board.filter(cell => !newCells.some(newCell => (newCell.row === cell.row && newCell.col === cell.col)   )));

            // setBoard(board => board.concat(new LineSegment(lastHoveredCell, hoveredCell).toCells()))
        }
    }

}
