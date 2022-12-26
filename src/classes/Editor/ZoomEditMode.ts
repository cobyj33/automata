import { PointerEvent, WheelEvent } from "react";
import {StatefulData} from "interfaces/StatefulData";
import { dotProductVector2, Vector2, vector2Normalized } from "interfaces/Vector2";
import {View} from "interfaces/View";
import { EditMode } from "classes/Editor/EditMode";

const zoomDirection = { 
    row: -1,
    col: -1
}

export interface ZoomData {
    viewData: StatefulData<View>;
    isPointerDown: boolean
}

export class ZoomEditMode extends EditMode<ZoomData> {
    cursor() { return 'url("https://img.icons8.com/external-royyan-wijaya-detailed-outline-royyan-wijaya/24/000000/external-magnifying-glass-interface-royyan-wijaya-detailed-outline-royyan-wijaya.png"), nwse-resize' }

    onPointerMove(event: PointerEvent<Element>) {
        const [, setView] = this.data.viewData;
        if (this.data.isPointerDown === true) {
            const movementVector: Vector2 = {
                row: event.movementY,
                col: event.movementX
            } 
            if (!(movementVector.row === 0 && movementVector.col === 0)) {
                setView(view =>  ({ ...view, cellSize:  Math.max(2, view.cellSize + Math.trunc(dotProductVector2(zoomDirection, vector2Normalized(movementVector)) )  ) }) )
            }
        }
    }

    onWheel(event: WheelEvent<Element>) {
        const [, setView] = this.data.viewData;
        const movementY = event.deltaY / 50;
        setView(view => ({...view, cellSize: Math.max(2, view.cellSize +  movementY) }) )
    }
}
