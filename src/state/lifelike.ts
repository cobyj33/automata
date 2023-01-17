import { clear } from "console";
import { MAX_CELL_SIZE, MIN_CELL_SIZE } from "data";
import { getShapeFunction, LifeLikeAvailableShapes, ShapeFunction } from "functions/shapes";
import { clamp } from "functions/util";
import { Box, IBox } from "interfaces/Box"
import { CellMatrix, ICellMatrix } from "interfaces/CellMatrix";
import { Dimension2D, IDimension2D } from "interfaces/Dimension";
import { addVector2, IVector2, Vector2, vector2AlterToCol, vector2Equals, vector2IsInteger } from "interfaces/Vector2"
import { View, IView } from "interfaces/View"
import { ImmerReducer, useImmer } from "use-immer";

export type LifeLikeEditorEditMode = "MOVE" | "ZOOM" | "DRAW" | "ERASE" | "BOX" | "LINE" | "ELLIPSE";

export interface LifeLikeEditorState {
    board: IVector2[],
    ghostBoard: IVector2[],
    bounds: IBox,
    view: IView,
    cursor: string,

    rendering: boolean,
    render: ICellMatrix,
    currentGeneration: number,

    lastHoveredCell: IVector2,
    currentHoveredCell: IVector2,
    rule: string,
    editMode: LifeLikeEditorEditMode,
    pattern: IVector2[],
    isPointerDown: boolean,
    viewport: IDimension2D
}

interface LifeLikeToggleRenderAction {
    type: "toggle render"
}

interface LifeLikePanEditorAction {
    type: "pan",
    amount: IVector2
}

interface LifeLikeZoomEditorAction {
    type: "zoom"
    amount: number
    viewportAnchor: IVector2
}

interface LifeLikeDrawEditorAction {
    type: "draw"
    position: IVector2
}

interface LifeLikeEraseEditorAction {
    type: "erase"
    position: IVector2
}




interface LifeLikeDrawShapeEditorAction {
    type: "draw shape",
    shape: LifeLikeAvailableShapes
    start: IVector2,
    end: IVector2
}


// interface LifeLikeSelectEditorAction {
//     type: "select"
//     area: number
//     anchor: IVector2
// }

interface LifeLikeClearEditorAction {
    type: "clear"
}

// interface LifeLikeRenderDataResetEditorAction {
//     type: "reset"
// }

// interface LifeLikeRenderDataHoveredCellMovedAction {
//     type: "move hovered cell",
//     row: number,
//     col: number
// }

type LifeLikeEditorActions = LifeLikePanEditorAction |
LifeLikeZoomEditorAction | 
LifeLikeDrawShapeEditorAction | 
LifeLikeDrawEditorAction | 
LifeLikeEraseEditorAction | LifeLikeToggleRenderAction | LifeLikeClearEditorAction

type LifeLikeEditorReducer = ImmerReducer<LifeLikeEditorState, LifeLikeEditorActions>
type LifeLikeEditorReducerActionHandler<T> = ImmerReducer<LifeLikeEditorState, T>

function canEditPosition(state: LifeLikeEditorState, point: IVector2) {
    return Box.fromData(state.bounds).pointInside(point) && vector2IsInteger(point)
}

const toggleRenderLifeLikeEditorReducer: LifeLikeEditorReducerActionHandler<LifeLikeToggleRenderAction> = (draft, action) => {
    draft.rendering = !draft.rendering;
    return draft;
}

const clearLifeLikeEditorReducer: LifeLikeEditorReducerActionHandler<LifeLikeClearEditorAction> = (draft, action) => {
    draft.board = []
    return draft;
}

const eraseLifeLikeEditorReducer: LifeLikeEditorReducerActionHandler<LifeLikeEraseEditorAction> = (draft, action) => {
    const { position } = action
    if (canEditPosition(draft, position)) {
        draft.board = draft.board.filter(pos => !vector2Equals(pos, position))
    }
    return draft
}

const drawLifeLikeEditorReducer: LifeLikeEditorReducerActionHandler<LifeLikeDrawEditorAction> = (draft, action) => {
    const { position } = action
    if (canEditPosition(draft, position)) {
        draft.board.push(position)
    }
    return draft
}

const drawShapeLifeLikeEditorReducer: LifeLikeEditorReducerActionHandler<LifeLikeDrawShapeEditorAction> = (draft, action) => {
    const { start, end, shape } = action
    const func = getShapeFunction(shape)
    const cells: IVector2[] = func(start, end)
    cells.forEach(pos => {
        if (canEditPosition(draft, pos)) {
            draft.board.push(pos)
        }
    })
    return draft;
}

const panLifeLikeEditor: LifeLikeEditorReducerActionHandler<LifeLikePanEditorAction> = (draft, action) => {
    const { amount } = action;
    draft.view.position = addVector2(draft.view.position, amount)
    return draft
}

const zoomLifeLikeEditor: LifeLikeEditorReducerActionHandler<LifeLikeZoomEditorAction> = (draft, action) => {
    const { amount, viewportAnchor } = action
    const newCellSize = clamp(draft.view.cellSize + amount, MIN_CELL_SIZE, MAX_CELL_SIZE)
    const viewportWorldSize = Dimension2D.fromData(draft.viewport).scale(1/draft.view.cellSize)
    const newViewportWorldSize = Dimension2D.fromData(draft.viewport).scale(1/newCellSize)
    const changeInViewportWorldSize = viewportWorldSize.subtract(newViewportWorldSize)
    const panAmount = new Vector2(changeInViewportWorldSize.scale( viewportAnchor.row ).height, changeInViewportWorldSize.scale( viewportAnchor.col ).width).data()
    draft.view = {  position: addVector2(draft.view.position, panAmount), cellSize: newCellSize   }
    return draft
}

export const lifeLikeReducer: LifeLikeEditorReducer = (draft, action) => {
    const { type } = action
    switch(type) {
        case "pan": return panLifeLikeEditor(draft, action)
        case "zoom": return zoomLifeLikeEditor(draft, action)
        case "draw": return drawLifeLikeEditorReducer(draft, action)
        case "draw shape": return drawShapeLifeLikeEditorReducer(draft, action)
        case "erase": return eraseLifeLikeEditorReducer(draft, action)
        case "toggle render": return toggleRenderLifeLikeEditorReducer(draft, action)
        case "clear": return clearLifeLikeEditorReducer(draft, action)
    }
}