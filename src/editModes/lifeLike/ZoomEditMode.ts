import { PointerEvent, WheelEvent } from "react";
import {StatefulData} from "jsutil/react";
import { IVector2, Vector2, View } from "jsutil";
import { EditMode } from "editModes/EditMode";
import { EditorData, LifeLikeEditorData } from "common/EditorData";
import { clamp } from "jsutil";
import { MIN_CELL_SIZE, MAX_CELL_SIZE } from "data";

const ZOOM_DIRECTION: Vector2 = new Vector2(-1, -1)


export class ZoomEditMode extends EditMode<EditorData> {
    cursor() { return 'url("https://img.icons8.com/external-royyan-wijaya-detailed-outline-royyan-wijaya/24/000000/external-magnifying-glass-interface-royyan-wijaya-detailed-outline-royyan-wijaya.png"), nwse-resize' }
    anchor: Vector2 = Vector2.ZERO
    anchorPercentage: Vector2 = Vector2.ZERO

    setAnchors(pos: IVector2) {
        this.anchor = Vector2.fromData(pos)
        const view = this.data.viewData[0]
        const viewport = this.data.viewportSize
        const worldViewport = viewport.scale(1/view.cellSize)
        this.anchorPercentage = new Vector2( (this.anchor.row - view.row) / worldViewport.height, (this.anchor.col - view.col) / worldViewport.width)
    }

    zoomBy(zoomVector: Vector2) {
        const [, setView] = this.data.viewData;
        if (!zoomVector.isZero()) {
            setView(view =>  {
                const zoomAmount = Math.trunc(ZOOM_DIRECTION.dot(zoomVector.normalize()))
                const newCellSize = clamp(view.cellSize + zoomAmount, MIN_CELL_SIZE, MAX_CELL_SIZE)
                const viewportWorldSize = this.data.viewportSize.scale(1/view.cellSize)
                const newViewportWorldSize = this.data.viewportSize.scale(1/newCellSize)
                const changeInViewportWorldSize = viewportWorldSize.subtract(newViewportWorldSize)

                const panAmount = new Vector2(changeInViewportWorldSize.scale( this.anchorPercentage.row ).height, changeInViewportWorldSize.scale( this.anchorPercentage.col ).width)

                return view.withCellSize(newCellSize).withPosition(pos => pos.add(panAmount))
            })
        }
    }

    onPointerDown(event: PointerEvent<Element>) {
        this.setAnchors(this.data.currentHoveredCell)
    }

    onPointerMove(event: PointerEvent<Element>) {
        if (this.data.isPointerDown === true) {
            const movementVector: Vector2 = new Vector2(event.movementY, event.movementX)
            this.zoomBy(movementVector);
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