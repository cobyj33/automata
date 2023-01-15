import { PointerEvent, WheelEvent } from "react";
import {StatefulData} from "interfaces/StatefulData";
import { Vector2 } from "interfaces/Vector2";
import {View} from "interfaces/View";
import { EditMode } from "classes/Editor/EditModes/EditMode";
import { EditorData, LifeLikeEditorData } from "interfaces/EditorData";

const zoomDirection: Vector2 = new Vector2(-1, -1)

const MIN_CELL_SIZE = 1;
export class ZoomEditMode extends EditMode<EditorData> {
    cursor() { return 'url("https://img.icons8.com/external-royyan-wijaya-detailed-outline-royyan-wijaya/24/000000/external-magnifying-glass-interface-royyan-wijaya-detailed-outline-royyan-wijaya.png"), nwse-resize' }
    anchor: Vector2 = Vector2.ZERO

    onPointerDown(event: PointerEvent<Element>) {
        this.anchor = Vector2.fromIVector2(this.data.currentHoveredCell)
    }

    onPointerMove(event: PointerEvent<Element>) {
        const [, setView] = this.data.viewData;
        if (this.data.isPointerDown === true) {
            const movementVector: Vector2 = new Vector2(event.movementY, event.movementX)
            if (!movementVector.isZero()) {
                setView(view =>  {
                    const zoomAmount = Math.trunc(zoomDirection.dot(movementVector.normalize()))
                    const newCellSize = Math.max(MIN_CELL_SIZE, view.cellSize + zoomAmount)
                    return view.withCellSize(newCellSize)  
                })
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