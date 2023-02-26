import { PointerEvent } from "react";
import { EditMode } from "editModes/EditMode";
import { StatefulData } from "common/StatefulData"
import { CellMatrix } from "common/CellMatrix"
import { ElementaryEditorData } from "common/EditorData";
import { range } from "common/util";

export function elementaryPlaceDown(data: ElementaryEditorData, toPlace: number)  {
    if (data.isRendering) {
        return;
    }

    const [, setBoard] = data.boardData;
    const hoveredColumn: number = data.currentHoveredColumn;
    
    setBoard(board => {
        if (hoveredColumn >= 0 && hoveredColumn < board.length) {
            const newBoard: number[] = [...board];
            newBoard[hoveredColumn] = toPlace;
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
    if (data.isPointerDown) {
        setBoard(board => {
            const line: number[] = range(data.lastHoveredColumn, data.currentHoveredColumn);
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