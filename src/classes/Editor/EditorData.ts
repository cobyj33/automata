import { StatefulData } from "../../interfaces/StatefulData";
import { Vector2 } from "../Data/Vector2";
import { View } from "../Data/View";
import { PointerEvent } from "react";

export interface EditorData {
    boardData: StatefulData<Vector2[]>;
    viewData: StatefulData<View>;
    lastHoveredCell: Vector2;
    isPointerDown: boolean;
    getHoveredCell: (event: PointerEvent<Element>) => Vector2;
    ghostTilePositions: StatefulData<Vector2[]>
}