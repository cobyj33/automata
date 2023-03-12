import { PointerEvent } from "react";
import { IVector2, Vector2, vector2ToLength, addVector2, View, clamp } from "jsutil";
import { EditMode } from "editModes/EditMode";
import { StatefulData } from 'common/StatefulData';
import { EditorData, ElementaryEditorData, LifeLikeEditorData } from "common/EditorData";
import MoveEditMode from "editModes/lifeLike/MoveEditMode";


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