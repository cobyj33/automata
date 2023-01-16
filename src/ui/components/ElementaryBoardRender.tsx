import { useEffect, useState, useRef, MutableRefObject } from "react";
import { View } from "interfaces/View"
import {BoundedBoardDrawing} from "ui/components/BoundedBoardDrawing";
import { CellMatrix } from "interfaces/CellMatrix";
import { getNextElementaryGeneration } from "functions/generationFunctions";
import { Vector2 } from "interfaces/Vector2";
import { concatUint8ClampedArrays } from "functions/util";

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

export const ElementaryBoardRender = ({ start, view,  rule, maxGeneration = Number.MAX_VALUE, controller: controllerRef }: { start: number[], view: View, rule: number, maxGeneration?: number, controller?: MutableRefObject<RenderController> }) => {
    const [currentRenderData, setCurrentRenderData] = useState<ElementaryRenderData>({
        cellMatrix: CellMatrix.fromNumberMatrix([start], Vector2.ZERO),
        currentLine: new Uint8ClampedArray(start)
    });

    useEffect( () => {
        if (controllerRef !== null && controllerRef !== undefined) {
            const controller = controllerRef.current
            controller.addEvent("restart", () => {
                setCurrentRenderData({
                        cellMatrix: CellMatrix.fromNumberMatrix([start], Vector2.ZERO),
                        currentLine: new Uint8ClampedArray(start)
                    })
            })
        }
    }, [])

    useEffect( () => {
        const currentGeneration = currentRenderData.cellMatrix.height

        if (currentRenderData.cellMatrix.area > 0 && currentGeneration < maxGeneration) {
            requestAnimationFrame(() => {
                setCurrentRenderData(( { cellMatrix: oldCellMatrix, currentLine: oldLine }) => {
                    const newLine: Uint8ClampedArray = getNextElementaryGeneration(oldLine, rule)
                    const newCellMatrix = new CellMatrix(concatUint8ClampedArrays(oldCellMatrix.cellData, newLine), oldCellMatrix.box.expand(0, 1))

                    return {
                        cellMatrix: newCellMatrix,
                        currentLine: newLine
                    }
                });
            })
        }

    }, [currentRenderData, rule])

    return <BoundedBoardDrawing board={currentRenderData.cellMatrix} view={view} bounds={currentRenderData.cellMatrix.box} />
}

export default ElementaryBoardRender