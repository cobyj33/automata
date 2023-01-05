import { PointerEvent } from "react";
import { IVector2, Vector2, vector2ToLength } from "interfaces/Vector2";
import { EditMode } from "classes/Editor/EditModes/EditMode";
import {addVector2} from "interfaces/Vector2";
import { StatefulData } from 'interfaces/StatefulData';
import { View } from 'interfaces/View';


export interface MoveData {
    viewData: StatefulData<View>;
    isPointerDown: boolean
}

export class MoveEditMode extends EditMode<MoveData>{
    cursor() { return 'move' }
     
    onPointerMove(event: PointerEvent<Element>) {
        const [view, setView] = this.data.viewData;
        if (this.data.isPointerDown === true) {
            const movementDirection: Vector2 = new Vector2(event.movementY, event.movementX)
            const MOVEMENT_LIMIT = 20 / view.cellSize
            if (!movementDirection.isZero()) {
                setView(view => view.withPosition(pos => pos.add(movementDirection.toLength(MOVEMENT_LIMIT))));
            }
        }
    }
}

export default MoveEditMode