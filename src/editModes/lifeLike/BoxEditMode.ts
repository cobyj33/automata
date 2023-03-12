import { KeyboardEvent, PointerEvent } from "react";
import {getLine, IVector2, filterVector2ListDuplicates, LineSegment, Box } from "jsutil";
import { StatefulData } from "common/StatefulData";
import { EditMode } from "editModes/EditMode";
import { LifeLikeEditorData } from "common/EditorData";
import { ShapeEditMode } from "./ShapeEditMode";

function boxCells(start: IVector2, end: IVector2): IVector2[] {
    const lines = Box.enclosed([start, end]).lines()
    return filterVector2ListDuplicates(lines.flatMap(line => getLine(line.start, line.end))) ?? []
}

export class BoxEditMode extends EditMode<LifeLikeEditorData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }
    shapemode: ShapeEditMode = new ShapeEditMode(boxCells)

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

export default BoxEditMode