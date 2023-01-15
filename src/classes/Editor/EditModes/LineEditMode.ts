import { KeyboardEvent, PointerEvent } from "react";
import { IVector2, filterVector2ListDuplicates, filterVector2ListMatches } from "interfaces/Vector2";
import { EditMode } from "classes/Editor/EditModes/EditMode";
import {getLine} from 'functions/shapes';
import {StatefulData} from "interfaces/StatefulData";
import { Box } from "interfaces/Box";
import { LineSegment } from "interfaces/LineSegment";
import { hover } from "@testing-library/user-event/dist/hover";
import { LifeLikeEditorData } from "interfaces/EditorData";
import { ShapeEditMode } from "./ShapeEditMode";

export class LineEditMode extends EditMode<LifeLikeEditorData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }
    shapemode: ShapeEditMode = new ShapeEditMode(getLine)

    onPointerDown(event: PointerEvent<Element>): void {
        this.shapemode.onPointerDown(event, this.data)
        
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
