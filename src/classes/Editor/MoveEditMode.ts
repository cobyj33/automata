import { PointerEvent } from "react";
import { Vector2, vector2ToLength } from "../../interfaces/Vector2";
import { EditMode } from "./EditMode";
import {addVector2} from "../../interfaces/Vector2";

export class MoveEditMode extends EditMode{
    cursor() { return 'move' }
     
    onPointerMove(event: PointerEvent<Element>) {
        const [, setView] = this.data.viewData;
        if (this.data.isPointerDown === true) {
            const movementDirection: Vector2 = {
                row: event.movementY,
                col: event.movementX
            } 

            if (!(movementDirection.row === 0 && movementDirection.col === 0)) {
                setView(view => ({...view, coordinates: addVector2(view.coordinates, vector2ToLength(movementDirection, 20 / view.cellSize) ) })  );
            }
        }
    }
}
