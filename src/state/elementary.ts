import { Dimension2D, IDimension2D } from "interfaces/Dimension";
import { IVector2 } from "interfaces/Vector2";
import { IView } from "interfaces/View";

export interface ElementaryEditorState {
    readonly board: number[],
    readonly ghostBoard: number[],
    readonly view: IView,
    readonly viewport: IDimension2D,
    readonly rule: number,
    readonly isPointerDown: boolean,
    readonly rendering: boolean,
    readonly currentGeneration: number,
    readonly currentHoveredColumn: number,
    readonly lastHoveredColumn: number,
    readonly currentHoveredCell: IVector2,
    readonly lastHoveredCell: IVector2
}


export type ElementaryEditorEditMode = "MOVE" | "ZOOM" | "DRAW" | "ERASE" | "LINE"