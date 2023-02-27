import React from "react";
import { View } from "common/View"
import { CellMatrix } from "common/CellMatrix";
import { getNextElementaryGeneration } from "libca/generationFunctions";
import { Vector2 } from "common/Vector2";
import { concatUint8ClampedArrays } from "common/util";
import BoardDrawing from "ui/components/BoardDrawing";

interface ElementaryRenderData {
    cellMatrix: CellMatrix,
    currentLine: Uint8ClampedArray
}

type Action = () => void
type RenderControllerActionTarget = "restart"
export class RenderController {
    private actions: { [key in RenderControllerActionTarget]: { [key: number]: Action } } = {
        "restart": {}
    }
    private nextActionUUID: number = 0;

    constructor() {}

    fire(target: RenderControllerActionTarget) {
        Object.values(this.actions[target]).forEach(action => action())
    }

    addEvent(target: RenderControllerActionTarget, action: Action): number {
        const eventID = this.nextActionUUID
        this.actions[target][eventID] = action
        this.nextActionUUID++;
        return eventID
        // this.actions.
    }

    private getTarget(id: number): RenderControllerActionTarget {
        const registeredActions: RenderControllerActionTarget[] = Object.keys(this.actions) as RenderControllerActionTarget[]
        registeredActions.filter(action => id in this.actions[action])
        return registeredActions[0]
    }

    // removeEvent(target: RenderControllerActionTarget, id: number) {
    //     Object.keys(this.actions).forEach(key => {
    //         key.
    //     })
    // }
}

type ElementaryRenderDataNextAction = { type: "next", rule: number }
type ElementaryRenderDataRestartAction = { type: "restart", startData: number[] }
type ElementaryRenderDataActions = ElementaryRenderDataNextAction | ElementaryRenderDataRestartAction

function getStartingElementaryBoardData(start: number[]): ElementaryRenderData {
    return {
        cellMatrix: CellMatrix.fromNumberMatrix([start], Vector2.ZERO),
        currentLine: new Uint8ClampedArray(start)
    }
}

function nextElementaryBoard(state: ElementaryRenderData, action: ElementaryRenderDataNextAction): ElementaryRenderData {
    const { currentLine: oldLine, cellMatrix: oldCellMatrix } = state
    const { rule } = action
    const newLine: Uint8ClampedArray = getNextElementaryGeneration(oldLine, rule)
    const newCellMatrix = new CellMatrix(concatUint8ClampedArrays(oldCellMatrix.cellData, newLine), oldCellMatrix.box.expand(0, 1))

    return {
        cellMatrix: newCellMatrix,
        currentLine: newLine
    }
}


function restartElementaryBoard(state: ElementaryRenderData, action: ElementaryRenderDataRestartAction): ElementaryRenderData {
    const { startData } = action
    return getStartingElementaryBoardData(startData)
}

type ElementaryRenderDataReducerFunction = React.Reducer<ElementaryRenderData, ElementaryRenderDataActions>
const renderStateReducer: ElementaryRenderDataReducerFunction = (state, action) => {
    const { type } = action
    switch (type) {
        case "next": return nextElementaryBoard(state, action)
        case "restart": return restartElementaryBoard(state, action)
    }
}

export const ElementaryBoardRender = ({ start, view,  rule, maxGeneration = Number.MAX_VALUE, controller: controllerRef }: { start: number[], view: View, rule: number, maxGeneration?: number, controller?: React.MutableRefObject<RenderController> }) => {
    const [renderData, renderDataDispatch] = React.useReducer<ElementaryRenderDataReducerFunction>(renderStateReducer, getStartingElementaryBoardData(start));
    const { cellMatrix } = renderData

    React.useEffect( () => {
        if (controllerRef !== null && controllerRef !== undefined) {
            const controller = controllerRef.current
            controller.addEvent("restart", () => {
                renderDataDispatch({ type: "restart", startData: start })
            })
        }
    }, [])

    React.useEffect(() => {
        renderDataDispatch({ type: "restart", startData: start })
    }, [start, rule])

    React.useEffect( () => {
        const currentGeneration = cellMatrix.height
        if (cellMatrix.area > 0 && currentGeneration < maxGeneration) {
            requestAnimationFrame(() => {
                renderDataDispatch({ type: "next", rule: rule })
            })
        }
    }, [renderData, rule])

    return <BoardDrawing board={cellMatrix} view={view} bounds={cellMatrix.box} />
}

export default ElementaryBoardRender