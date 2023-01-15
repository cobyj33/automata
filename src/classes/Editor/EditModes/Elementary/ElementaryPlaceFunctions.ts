import { PointerEvent } from "react";
import { EditMode } from "classes/Editor/EditModes/EditMode";
import { StatefulData } from "interfaces/StatefulData"
import { CellMatrix } from "interfaces/CellMatrix"
import { ElementaryEditorData } from "interfaces/EditorData";
import { range } from "functions/util";

export function elementaryPlaceDown(data: ElementaryEditorData, toPlace: number)  {
    if (data.isRendering) {
        return;
    }

    const [, setBoard] = data.boardData;
    const hoveredCell: number = data.currentHoveredCell;
    
    setBoard(board => {
        if (hoveredCell >= 0 && hoveredCell < board.length) {
            const newBoard: number[] = [...board];
            newBoard[hoveredCell] = toPlace;
            return newBoard
        }
        return board;
    })
}

export function elementaryPlaceMove(data: ElementaryEditorData, toPlace: number) {
    if (data.isRendering) {
        return;
    }

    const [, setBoard] = data.boardData;
    const hoveredCell: number = data.currentHoveredCell;
    const lastHoveredCell: number = data.lastHoveredCell;
    if (data.isPointerDown) {
        setBoard(board => {
            const line: number[] = range(lastHoveredCell, hoveredCell);
            const newBoard: number[] = [...board]

            line.forEach(lineCell => {
                if (lineCell >= 0 && lineCell < newBoard.length) {
                    newBoard[lineCell] = toPlace;
                }
            })

            return newBoard
        })
    }
}