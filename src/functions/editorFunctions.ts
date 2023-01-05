import { PointerEvent } from "react";
import { IVector2, Vector2 } from "interfaces/Vector2";
import { View } from "interfaces/View";

export function pointerPositionInElement(event: PointerEvent<Element>, element: Element): Vector2 {
    const canvasBounds: DOMRect = element.getBoundingClientRect();
    return new Vector2(Math.trunc(event.clientY - canvasBounds.y), Math.trunc(event.clientX - canvasBounds.x))
}

export const getHoveredCell = (pointerPosition: Vector2, view: View) => {
    return pointerPosition.scale(1/view.cellSize).add(view.position)
}
