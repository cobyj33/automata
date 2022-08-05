import { KeyboardEvent, PointerEvent, WheelEvent } from "react";


export abstract class EditMode<Data> {
    protected data: Data;

    constructor(data: Data) {
        this.data = data;
    }
    
    setEditorData(data: Data) {
        this.data = data;
    }

    onPointerDown?(event: PointerEvent<Element>): void;
    onPointerUp?(event: PointerEvent<Element>): void;
    onPointerMove?(event: PointerEvent<Element>): void;
    onPointerLeave?(event: PointerEvent<Element>): void;
    onPointerEnter?(event: PointerEvent<Element>): void;
    onWheel?(event: WheelEvent<Element>): void;

    onKeyDown?(event: KeyboardEvent<Element>): void;
    onKeyUp?(event: KeyboardEvent<Element>): void;

    // abstract onModeStart(): void;
    // abstract onModeEnd(): void;
    abstract cursor(): string;
}
