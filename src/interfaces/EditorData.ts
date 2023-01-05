import { StatefulData } from "interfaces/StatefulData";
import { IVector2 } from "interfaces/Vector2";
import { View } from "interfaces/View";
import { PointerEvent } from "react";

export interface EditorData {
    boardData: StatefulData<IVector2[]>;
    viewData: StatefulData<View>;
    lastHoveredCell: IVector2;
    isPointerDown: boolean;
    getHoveredCell: (event: PointerEvent<Element>) => IVector2;
    ghostTilePositions: StatefulData<IVector2[]>
}
