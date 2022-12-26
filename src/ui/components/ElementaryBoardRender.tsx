import { useEffect, useState, useRef } from "react";
import { View } from "interfaces/View"
import {BoundedBoardDrawing} from "ui/components/BoundedBoardDrawing";
import { CellMatrix } from "interfaces/CellMatrix";
import {getNextElementaryGenerationAsync} from "functions/generationFunctions";

export const ElementaryBoardRender = ({start, view,  rule}: { start: number[], view: View, rule: number }) => {
    const [cellMatrix, setCellMatrix] = useState<CellMatrix>({
        row: 0,
        col: 0,
        width: start.length,
        height: 1,
        matrix: new Uint8ClampedArray(start)
    });


    useEffect( () => {
        if (cellMatrix.matrix.length > 0) {
            requestAnimationFrame(() => {
                const currentLine: Uint8ClampedArray = cellMatrix.matrix.subarray(cellMatrix.matrix.length - cellMatrix.width, cellMatrix.matrix.length);
                getNextElementaryGenerationAsync(currentLine, rule)
                    .then( newLine => {
                        const newMatrix = new Uint8ClampedArray(cellMatrix.matrix.length + cellMatrix.width);
                        newMatrix.set(cellMatrix.matrix, 0);
                        newMatrix.set(newLine, cellMatrix.matrix.length);

                        setCellMatrix(cellMatrix => { 
                            return {
                                ...cellMatrix,
                                height: cellMatrix.height + 1,
                                matrix: newMatrix 
                            }
                        } );
                    } )
            })
        }
    }, [cellMatrix, rule])

    return (
        <div>            
            <BoundedBoardDrawing board={cellMatrix} view={view} bounds={cellMatrix} />
        </div>
    )
}
