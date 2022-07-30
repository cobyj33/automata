import { PointerEvent } from "react";
import { Vector2 } from "../classes/Data/Vector2";
import { View } from "../classes/Data/View";

export function pointerPositionInElement(event: PointerEvent<Element>, element: Element): Vector2 {
    const canvasBounds: DOMRect = element.getBoundingClientRect();
    return new Vector2(event.clientY - canvasBounds.y, event.clientX - canvasBounds.x).int();
}

export const getHoveredCell = (pointerPosition: Vector2, view: View) => {
    return new Vector2( (pointerPosition.row / view.cellSize) + view.coordinates.row, (pointerPosition.col / view.cellSize) + view.coordinates.col ).int()
}