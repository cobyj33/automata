import { PointerEvent, WheelEvent } from "react";
import {StatefulData} from "interfaces/StatefulData";
import { Vector2 } from "interfaces/Vector2";
import {View} from "interfaces/View";
import { EditMode } from "classes/Editor/EditModes/EditMode";

const zoomDirection: Vector2 = new Vector2(-1, -1).normalize()

export interface ZoomData {
    viewData: StatefulData<View>;
    isPointerDown: boolean
}

const MIN_CELL_SIZE = 2;
export class ZoomEditMode extends EditMode<ZoomData> {
    cursor() { return 'url("https://img.icons8.com/external-royyan-wijaya-detailed-outline-royyan-wijaya/24/000000/external-magnifying-glass-interface-royyan-wijaya-detailed-outline-royyan-wijaya.png"), nwse-resize' }

    onPointerMove(event: PointerEvent<Element>) {
        const [, setView] = this.data.viewData;
        if (this.data.isPointerDown === true) {
            const movementVector: Vector2 = new Vector2(event.movementY, event.movementX)
            if (!movementVector.isZero()) {
                setView(view =>  view.withCellSize(curr => Math.max(MIN_CELL_SIZE, curr + Math.trunc(zoomDirection.dot(movementVector.normalize())))) )
            }
        }
    }

    onWheel(event: WheelEvent<Element>) {
        const [, setView] = this.data.viewData;
        const SCROLL_LIMITER = 50
        const movementY = event.deltaY / SCROLL_LIMITER;
        setView(view => view.withCellSize(curr => Math.max(MIN_CELL_SIZE, curr + movementY)))
    }
}

export default ZoomEditMode