import { StatefulData } from "jsutil/react";
import { IVector2, View, Box, Dimension2D } from "jsutil";

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

