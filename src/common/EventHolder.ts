import { KeyboardEvent, PointerEvent } from "react";

export type PointerEventBlueprint = (event: PointerEvent<Element>) => void;
export type KeyboardEventBlueprint = (event: KeyboardEvent<Element>) => void;

export interface EventHolder {
    onPointerDown: PointerEventBlueprint,
    onPointerUp: PointerEventBlueprint,
    onPointerEnter: PointerEventBlueprint,
    onPointerLeave: PointerEventBlueprint,
    onPointerMove: PointerEventBlueprint,
    onKeyDown: KeyboardEventBlueprint,
    onKeyUp: KeyboardEventBlueprint
}