import { useEffect, useState, useRef } from "react";
import { View } from "../interfaces/View"
import {BoundedBoardDrawing} from "./BoundedBoardDrawing";
import { CellMatrix } from "../interfaces/CellMatrix";
import { IKernelRunShortcut } from "gpu.js"
import { getElementaryKernel } from "../functions/generationFunctions"


export const ElementaryBoardRender = ({start, view,  rule}: { start: number[], view: View, rule: number }) => {
    const [cellMatrix, setCellMatrix] = useState<CellMatrix>({
        row: 0,
        col: 0,
        width: start.length,
        height: 1,
        matrix: start
    });


    const [currentGeneration, setCurrentGeneration] = useState<number>(0);
    const renderingKernel = useRef<IKernelRunShortcut>(getElementaryKernel(rule).setOutput([cellMatrix.width]).setDynamicArguments(true).setDynamicOutput(true))

    useEffect( () => {
        if (cellMatrix.matrix.length > 0) {
            requestAnimationFrame(() => {
                setCellMatrix(cellMatrix => { 

                    if (renderingKernel.current.output.length === 1) {
                        if (renderingKernel.current.output[0] !== start.length) {
                            renderingKernel.current.setOutput([start.length]);
                        }
                    } else {
                        renderingKernel.current.setOutput([start.length]);
                    }

                    return ({
                        ...cellMatrix,
                        height: cellMatrix.height + 1,
                        matrix: cellMatrix.matrix.concat([...(renderingKernel.current([...cellMatrix.matrix].slice(-cellMatrix.width), cellMatrix.width) as number[])])
                    })  }   );
                setCurrentGeneration(currentGeneration => currentGeneration + 1);
            })
        }
    }, [cellMatrix])

    useEffect( () => {
        renderingKernel.current.setOutput([cellMatrix.width]);
    }, [start])


    
    return (
        <div className="elementary-board-render">            
            <BoundedBoardDrawing board={cellMatrix} view={view} bounds={cellMatrix} />
        </div>
    )
}
