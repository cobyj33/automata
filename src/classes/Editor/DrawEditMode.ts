import { PointerEvent } from "react";
import { removeDuplicates } from "../../functions/utilityFunctions";
import { EditMode } from "./EditMode";
import { getLine } from "../../functions/shapes";

export class DrawEditMode extends EditMode {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }

    onPointerDown(event: PointerEvent<Element>) {
        const [, setBoard] = this.data.boardData;
        const hoveredCell = this.data.getHoveredCell(event);

        setBoard(board => removeDuplicates(board.concat(hoveredCell)));
    }

    onPointerMove(event: PointerEvent<Element>) {
        const [, setBoard] = this.data.boardData;
        const hoveredCell = this.data.getHoveredCell(event);
        const lastHoveredCell = this.data.lastHoveredCell;
        if (this.data.isPointerDown) {
            setBoard(board => removeDuplicates(board.concat( getLine(lastHoveredCell, hoveredCell) )) )
        }
    }

}
