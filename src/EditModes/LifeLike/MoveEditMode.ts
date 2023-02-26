import { PointerEvent } from "react";
import { IVector2, Vector2, vector2ToLength } from "common/Vector2";
import { EditMode } from "EditModes/EditMode";
import {addVector2} from "common/Vector2";
import { StatefulData } from 'common/StatefulData';
import { View } from 'common/View';
import { EditorData, LifeLikeEditorData } from "common/EditorData";


export class MoveEditMode extends EditMode<EditorData>{
    cursor() { return 'move' }

    moveBy(movementVector: Vector2) {
        const setView = this.data.viewData[1];
        if (!movementVector.isZero()) {
            setView(view => view.withPosition(pos => pos.add(movementVector)));
        }
    }

    onPointerMove(event: PointerEvent<Element>) {
        if (this.data.isPointerDown === true) {
            const view = this.data.viewData[0];
            const movementDirection: Vector2 = new Vector2(event.movementY, event.movementX)
            const MOVEMENT_LIMIT = 20 / view.cellSize
            if (movementDirection.isZero() == false) {
                this.moveBy(movementDirection.toLength(MOVEMENT_LIMIT));
            }
        }
    }
}

export default MoveEditMode