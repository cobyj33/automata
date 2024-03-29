import { KeyboardEvent, PointerEvent } from "react";
import { IVector2, filterVector2ListDuplicates, filterVector2ListMatches, Box, LineSegment, getLine } from "jsutil";
import { EditMode } from "editModes/EditMode";
import {StatefulData} from "jsutil/react";
import { hover } from "@testing-library/user-event/dist/hover";
import { LifeLikeEditorData } from "common/EditorData";
import { ShapeEditMode } from "./ShapeEditMode";

export class LineEditMode extends EditMode<LifeLikeEditorData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }
    shapemode: ShapeEditMode = new ShapeEditMode(getLine)

    onPointerDown(event: PointerEvent<Element>): void {
        this.shapemode.onPointerDown(event, this.data)
    }

    onPointerLeave(event: PointerEvent<Element>): void {
        this.shapemode.onPointerLeave(event, this.data)
    }

    onPointerMove(event: PointerEvent<Element>): void {
        this.shapemode.onPointerMove(event, this.data)
    }

    onPointerUp(event: PointerEvent<Element>): void {
        this.shapemode.onPointerUp(event, this.data)
    }

    onKeyDown(event: KeyboardEvent<Element>): void {
        this.shapemode.onKeyDown(event, this.data)
    }

    onKeyUp(event: KeyboardEvent<Element>): void {
        this.shapemode.onKeyUp(event, this.data)
    }
}

export default LineEditMode
