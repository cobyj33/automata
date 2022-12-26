import { PointerEvent } from "react";
import { EditMode } from "classes/Editor/EditModes/EditMode";
import { getLine } from "functions/shapes";
import { StatefulData } from "interfaces/StatefulData"
import { Vector2 } from "interfaces/Vector2"

export interface EraseData {
    boardData: StatefulData<Vector2[]>,
    ghostTilePositions: StatefulData<Vector2[]>,
    getHoveredCell: (event: PointerEvent<Element>) => Vector2,
    lastHoveredCell: Vector2,
    isPointerDown: boolean,
        isRendering: boolean;
}

export class EraseEditMode extends EditMode<EraseData> {
    cursor() { return 'url("https://img.icons8.com/material-rounded/24/00000/eraser.png"), crosshair' }
    
    onPointerDown(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            return;
        }

        const [, setBoard] = this.data.boardData;
        const hoveredCell = this.data.getHoveredCell(event);
        setBoard(board => board.filter(cell => !(cell.row === hoveredCell.row && cell.col === hoveredCell.col)  ));
    }

    onPointerMove(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            return;
        }

        const [, setBoard] = this.data.boardData;
        const hoveredCell = this.data.getHoveredCell(event);
        const lastHoveredCell = this.data.lastHoveredCell;
        if (this.data.isPointerDown) {
            const newCells = getLine(lastHoveredCell, hoveredCell) 
            setBoard(board => board.filter(cell => !newCells.some(newCell => (newCell.row === cell.row && newCell.col === cell.col)   )));
        }
    }

}

export default EraseEditMode
