import { PointerEvent } from "react";
import { IVector2, Vector2, vector2ToLength } from "common/Vector2";
import { EditMode } from "EditModes/EditMode";
import {addVector2} from "common/Vector2";
import { StatefulData } from 'common/StatefulData';
import { View } from 'common/View';
import { EditorData, ElementaryEditorData, LifeLikeEditorData } from "common/EditorData";
import MoveEditMode from "../MoveEditMode";
import { clamp } from "common/util";


export class ElementaryMoveEditMode extends EditMode<ElementaryEditorData>{
    cursor() { return 'move' }
     
    onPointerMove(event: PointerEvent<Element>) {
        if (this.data.isPointerDown === true) {
            const [view, setView] = this.data.viewData
            const MOVEMENT_LIMITER = 20 / view.cellSize
            
            const rawMovementVector: Vector2 = new Vector2(event.movementY, event.movementX);
            if (!rawMovementVector.isZero()) {
                const movementVector = this.data.isRendering ? rawMovementVector.toLength(MOVEMENT_LIMITER) : rawMovementVector.toLength(MOVEMENT_LIMITER).colcomp();
                setView(view => view.withPosition(pos => pos.add(movementVector) ) );
            }
        }
    }
}

export default ElementaryMoveEditMode