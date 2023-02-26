import { PointerEvent } from "react";
import { EditMode } from "classes/Editor/EditModes/EditMode";
import { getLine } from "functions/shapes";
import { StatefulData } from "common/StatefulData"
import { IVector2, filterVector2ListDuplicates } from "common/Vector2"
import { LifeLikeEditorData } from "common/EditorData";

export class DrawEditMode extends EditMode<LifeLikeEditorData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }

    onPointerDown(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            return;
        }

        const setBoard = this.data.boardData[1];
        const bounds = this.data.boundsData[0]
        const hoveredCell = this.data.currentHoveredCell;
        setBoard(board => filterVector2ListDuplicates(board.concat(hoveredCell)).filter(cell => bounds.pointInside(cell))  );
    }

    onPointerMove(event: PointerEvent<Element>) {
        const setBoard = this.data.boardData[1];
        const bounds = this.data.boundsData[0]
        const hoveredCell = this.data.currentHoveredCell;
        const lastHoveredCell = this.data.lastHoveredCell;
        if (this.data.isPointerDown && !this.data.isRendering) {
            setBoard(board => filterVector2ListDuplicates(board.concat( getLine(lastHoveredCell, hoveredCell) )).filter(cell => bounds.pointInside(cell)) )
        }
    }
}

export default DrawEditMode
