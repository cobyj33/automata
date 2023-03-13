import { PointerEvent } from "react";
import { EditMode } from "editModes/EditMode";
import { getLine , Vector2} from "jsutil";
import { StatefulData } from "jsutil/react"
import { LifeLikeEditorData } from "common/EditorData";

export class EraseEditMode extends EditMode<LifeLikeEditorData> {
    cursor() { return 'url("https://img.icons8.com/material-rounded/24/00000/eraser.png"), crosshair' }
    
    onPointerDown(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            return;
        }

        const setBoard = this.data.boardData[1];
        const hoveredCell = this.data.currentHoveredCell;
        setBoard(board => board.filter(cell => !(cell.row === hoveredCell.row && cell.col === hoveredCell.col)  ));
    }

    onPointerMove(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            return;
        }

        const setBoard = this.data.boardData[1];
        const hoveredCell = this.data.currentHoveredCell;
        const lastHoveredCell = this.data.lastHoveredCell;
        if (this.data.isPointerDown) {
            const newCells = getLine(lastHoveredCell, hoveredCell) 
            setBoard(board => board.filter(cell => !newCells.some(newCell => (newCell.row === cell.row && newCell.col === cell.col)   )));
        }
    }

}

export default EraseEditMode
