import { PointerEvent } from "react";
import { IVector2, Vector2 } from "interfaces/Vector2";
import { View } from "interfaces/View";

// export function pointerPositionInElement(event: PointerEvent<Element>, element: Element): Vector2 {
//     const canvasBounds: DOMRect = element.getBoundingClientRect();
//     return new Vector2(Math.trunc(event.clientY - canvasBounds.y), Math.trunc(event.clientX - canvasBounds.x))
// }

export function pointerPositionInElement(event: PointerEvent<Element>): Vector2 {
    const bounds: DOMRect = event.currentTarget.getBoundingClientRect();
    return new Vector2(Math.trunc(event.clientY - bounds.y), Math.trunc(event.clientX - bounds.x))
}



export function getHoveredCell(pointerPosition: Vector2, view: View): Vector2 {
    return pointerPosition.scale(1/view.cellSize).add(view.position)
}

export function editorCanvasToWorld(canvasPosition: IVector2, view: View): Vector2 {
    return new Vector2(canvasPosition.row / view.cellSize - view.row, canvasPosition.col / view.cellSize - view.col)
}

export function editorWorldToCanvas(worldPosition: IVector2, view: View): Vector2 {
    return new Vector2((view.row + worldPosition.row) * view.cellSize, (view.col + worldPosition.col) * view.cellSize)
}