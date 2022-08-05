import { PointerEvent } from "react";
import { Vector2, vector2ToLength } from "../../interfaces/Vector2";
import { EditMode } from "./EditMode";
import {addVector2} from "../../interfaces/Vector2";
import { StatefulData } from '../../interfaces/StatefulData';
import { View } from '../../interfaces/View';


export interface MoveData {
    viewData: StatefulData<View>;
    isPointerDown: boolean
}

export class MoveEditMode extends EditMode<MoveData>{
    cursor() { return 'move' }
     
    onPointerMove(event: PointerEvent<Element>) {
        const [, setView] = this.data.viewData;
        if (this.data.isPointerDown === true) {
            const movementDirection: Vector2 = {
                row: event.movementY,
                col: event.movementX
            } 

            if (!(movementDirection.row === 0 && movementDirection.col === 0)) {
                setView(view => ({...view, ...addVector2(view, vector2ToLength(movementDirection, 20 / view.cellSize) ) })  );
            }
        }
    }
}
