import { PointerEvent } from "react";
import { Vector2 } from "../interfaces/Vector2";
import { View } from "../interfaces/View";

export function pointerPositionInElement(event: PointerEvent<Element>, element: Element): Vector2 {
    const canvasBounds: DOMRect = element.getBoundingClientRect();
    return {
        row: Math.trunc(event.clientY - canvasBounds.y),
        col: Math.trunc(event.clientX - canvasBounds.x) 
    }
}

export const getHoveredCell = (pointerPosition: Vector2, view: View) => {
    return {
        row:  Math.trunc((pointerPosition.row / view.cellSize) + view.row),
        col: Math.trunc((pointerPosition.col / view.cellSize) + view.col) 
    }
}
