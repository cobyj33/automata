import { PointerEvent, KeyboardEvent } from "react";
import { IVector2, filterVector2ListDuplicates } from "common/Vector2";
import { getEllipse } from "common/shapes";
import { EditMode } from "EditModes/EditMode";
import { StatefulData } from "common/StatefulData";
import { LifeLikeEditorData } from "common/EditorData";
import { ShapeEditMode } from "./ShapeEditMode";


export class EllipseEditMode extends EditMode<LifeLikeEditorData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }
    shapemode: ShapeEditMode = new ShapeEditMode(getEllipse)

    onPointerDown(event: PointerEvent<Element>): void {
        this.shapemode.onPointerDown(event, this.data)
    }

    onPointerMove(event: PointerEvent<Element>): void {
        this.shapemode.onPointerMove(event, this.data)
    }

    onPointerUp(event: PointerEvent<Element>): void {
        this.shapemode.onPointerUp(event, this.data)
    }

    onPointerLeave(event: PointerEvent<Element>): void {
        this.shapemode.onPointerLeave(event, this.data)
    }

    onKeyDown(event: KeyboardEvent<Element>): void {
        this.shapemode.onKeyDown(event, this.data)
    }

    onKeyUp(event: KeyboardEvent<Element>): void {
        this.shapemode.onKeyUp(event, this.data)
    }
}

export default EllipseEditMode
