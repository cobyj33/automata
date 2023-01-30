import { PointerEvent } from "react";
import { IVector2, Vector2, vector2ToLength } from "interfaces/Vector2";
import { EditMode } from "classes/Editor/EditModes/EditMode";
import {addVector2} from "interfaces/Vector2";
import { StatefulData } from 'interfaces/StatefulData';
import { View } from 'interfaces/View';
import { EditorData, LifeLikeEditorData } from "interfaces/EditorData";


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
            this.moveBy(movementDirection.toLength(MOVEMENT_LIMIT));
        }
    }
}

export default MoveEditMode