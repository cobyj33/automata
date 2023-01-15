import { PointerEvent } from "react";
import { EditMode } from "classes/Editor/EditModes/EditMode";
import { StatefulData } from "interfaces/StatefulData"
import { CellMatrix } from "interfaces/CellMatrix"
import { ElementaryEditorData } from "interfaces/EditorData";
import { range } from "functions/util";

export class ElementaryEraseEditMode extends EditMode<ElementaryEditorData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }

    onPointerDown(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            return;
        }

        const [, setBoard] = this.data.boardData;
        const hoveredCell: number = this.data.currentHoveredCell;
        
        setBoard(board => {
            if (hoveredCell >= 0 && hoveredCell < board.length) {
                const newBoard: number[] = [...board];
                newBoard[hoveredCell] = 0;
                return newBoard
            }
            return board;
        })
    }

    onPointerMove(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            return;
        }

        const [, setBoard] = this.data.boardData;
        const hoveredCell: number = this.data.currentHoveredCell;
        const lastHoveredCell: number = this.data.lastHoveredCell;
        
        if (this.data.isPointerDown) {
            setBoard(board => {
                const line: number[] = range(lastHoveredCell, hoveredCell);
                const newBoard: number[] = [...board]

                line.forEach(lineCell => {
                    if (lineCell >= 0 && lineCell < newBoard.length) {
                        newBoard[lineCell] = 0;
                    }
                })

                return newBoard
            })
        }
    }

}

export default ElementaryEraseEditMode