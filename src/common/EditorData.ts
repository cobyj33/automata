import { StatefulData } from "common/StatefulData";
import { IVector2 } from "common/Vector2";
import { View } from "common/View";
import { PointerEvent } from "react";
import { Box } from "./Box";
import { Dimension2D } from "./Dimension";

export interface EditorData {
    readonly viewData: StatefulData<View>;
    readonly viewportSize: Dimension2D
    readonly isRendering: boolean;
    readonly isPointerDown: boolean;
    readonly lastHoveredCell: IVector2;
    readonly currentHoveredCell: IVector2;
}

export interface LifeLikeEditorData extends EditorData  {
    readonly boardData: StatefulData<IVector2[]>;
    readonly boundsData: StatefulData<Box>;
    readonly ghostTilePositions: StatefulData<IVector2[]>
}


export interface ElementaryEditorData extends EditorData {
    readonly boardData: StatefulData<number[]>;
    readonly ghostTilePositions: StatefulData<number[]>;
    readonly lastHoveredColumn: number;
    readonly currentHoveredColumn: number;
}

