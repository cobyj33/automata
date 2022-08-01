import { StatefulData } from "./StatefulData";
import { Vector2 } from "./Vector2";
import { View } from "./View";
import { PointerEvent } from "react";

export interface EditorData {
    boardData: StatefulData<Vector2[]>;
    viewData: StatefulData<View>;
    lastHoveredCell: Vector2;
    isPointerDown: boolean;
    getHoveredCell: (event: PointerEvent<Element>) => Vector2;
    ghostTilePositions: StatefulData<Vector2[]>
}
