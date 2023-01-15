import { PointerEvent } from "react";
import { EditMode } from "classes/Editor/EditModes/EditMode";
import { StatefulData } from "interfaces/StatefulData"
import { CellMatrix } from "interfaces/CellMatrix"
import { ElementaryEditorData } from "interfaces/EditorData";
import { range } from "functions/util";
import { elementaryPlaceDown, elementaryPlaceMove } from "./ElementaryPlaceFunctions";


export class ElementaryDrawEditMode extends EditMode<ElementaryEditorData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }

    onPointerDown(event: PointerEvent<Element>) {
        elementaryPlaceDown(this.data, 1)
    }

    onPointerMove(event: PointerEvent<Element>) {
        elementaryPlaceMove(this.data, 1)
    }
}

export default ElementaryDrawEditMode