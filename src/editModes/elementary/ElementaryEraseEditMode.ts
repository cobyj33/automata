import { PointerEvent } from "react";
import { EditMode } from "editModes/EditMode";
import { StatefulData } from "jsutil/react"
import { CellMatrix } from "common/CellMatrix"
import { ElementaryEditorData } from "common/EditorData";
import { range } from "jsutil";
import { elementaryPlaceDown, elementaryPlaceMove } from "editModes/elementary/ElementaryPlaceFunctions";

export class ElementaryEraseEditMode extends EditMode<ElementaryEditorData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }

    onPointerDown(event: PointerEvent<Element>) {
        elementaryPlaceDown(this.data, 0)
    }

    onPointerMove(event: PointerEvent<Element>) {
        elementaryPlaceMove(this.data, 0)
    }
}

export default ElementaryEraseEditMode