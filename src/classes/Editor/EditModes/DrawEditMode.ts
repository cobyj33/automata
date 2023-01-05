import { PointerEvent } from "react";
import { removeDuplicates } from "functions/utilityFunctions";
import { EditMode } from "classes/Editor/EditModes/EditMode";
import { getLine } from "functions/shapes";
import { StatefulData } from "interfaces/StatefulData"
import { IVector2 } from "interfaces/Vector2"

export interface DrawData {
    boardData: StatefulData<IVector2[]>,
    getHoveredCell: (event: PointerEvent<Element>) => IVector2,
    lastHoveredCell: IVector2,
    isPointerDown: boolean,
        isRendering: boolean;
}

export class DrawEditMode extends EditMode<DrawData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }

    onPointerDown(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            return;
        }

        const [, setBoard] = this.data.boardData;
        const hoveredCell = this.data.getHoveredCell(event);

        setBoard(board => removeDuplicates(board.concat(hoveredCell)));
    }

    onPointerMove(event: PointerEvent<Element>) {
        const [, setBoard] = this.data.boardData;
        const hoveredCell = this.data.getHoveredCell(event);
        const lastHoveredCell = this.data.lastHoveredCell;
        if (this.data.isPointerDown && !this.data.isRendering) {
            setBoard(board => removeDuplicates(board.concat( getLine(lastHoveredCell, hoveredCell) )) )
        }
    }

}

export default DrawEditMode
