import { useEffect, useState, useRef } from "react";
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

export const ElementaryBoardRender = ({ start, view,  rule }: { start: number[], view: View, rule: number }) => {
    const [currentRenderData, setCurrentRenderData] = useState<ElementaryRenderData>({
        cellMatrix: CellMatrix.fromNumberMatrix([start], new Vector2(0, 0)),
        currentLine: new Uint8ClampedArray(start)
    });


    useEffect( () => {
        if (currentRenderData.cellMatrix.area > 0) {
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