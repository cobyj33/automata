import { PointerEvent } from "react";
import { IVector2, Vector2, vector2ToLength } from "interfaces/Vector2";
import { EditMode } from "classes/Editor/EditModes/EditMode";
import {addVector2} from "interfaces/Vector2";
import { StatefulData } from 'interfaces/StatefulData';
import { View } from 'interfaces/View';
import { EditorData, ElementaryEditorData, LifeLikeEditorData } from "interfaces/EditorData";
import MoveEditMode from "../MoveEditMode";
import { clamp } from "functions/util";


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