import { PointerEvent, WheelEvent } from "react";
import {StatefulData} from "jsutil/react";
import { Vector2, View } from "jsutil";
import { EditMode } from "editModes/EditMode";
import { EditorData, LifeLikeEditorData } from "common/EditorData";
import { clamp } from "jsutil";
import { MIN_CELL_SIZE, MAX_CELL_SIZE } from "data";
import ZoomEditMode from "editModes/lifeLike/ZoomEditMode";

const ZOOM_DIRECTION: Vector2 = new Vector2(-1, -1)


export class ElementaryZoomEditMode extends EditMode<EditorData> {
    cursor() { return 'url("https://img.icons8.com/external-royyan-wijaya-detailed-outline-royyan-wijaya/24/000000/external-magnifying-glass-interface-royyan-wijaya-detailed-outline-royyan-wijaya.png"), nwse-resize' }
    zoomMode: ZoomEditMode = new ZoomEditMode(this.data);

    anchor: Vector2 = Vector2.ZERO
    anchorPercentage: Vector2 = Vector2.ZERO

    override sendUpdatedEditorData(data: EditorData) {
        super.sendUpdatedEditorData(data)
        this.zoomMode.sendUpdatedEditorData(data);
    }

    onPointerDown(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            this.zoomMode.setAnchors(Vector2.fromData(this.data.currentHoveredCell))
        } else {
            this.zoomMode.setAnchors(Vector2.fromData(this.data.currentHoveredCell).colcomp())
        }
    }

    onPointerMove(event: PointerEvent<Element>) {
        this.zoomMode.onPointerMove(event);
    }

    onWheel(event: WheelEvent<Element>) {
        this.zoomMode.onWheel(event);
    }
}

export default ElementaryZoomEditMode