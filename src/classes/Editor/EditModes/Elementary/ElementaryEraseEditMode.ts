import { PointerEvent } from "react";
import { EditMode } from "classes/Editor/EditModes/EditMode";
import { StatefulData } from "interfaces/StatefulData"
import { CellMatrix } from "interfaces/CellMatrix"

function range(first: number, second: number): number[] {
    const min: number = Math.min(first, second);
    const distance: number = Math.abs(first - second);
    return Array.from({length: distance}, (val, index) => index + min);
}

export interface ElementaryEraseData {
    boardData: StatefulData<CellMatrix>,
    getHoveredCell: (event: PointerEvent<Element>) => number,
    lastHoveredCell: number,
    isPointerDown: boolean,
    isRendering: boolean;
}

export class ElementaryEraseEditMode extends EditMode<ElementaryEraseData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }

    onPointerDown(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            return;
        }

        const [, setCellMatrix] = this.data.boardData;
        const hoveredCell = this.data.getHoveredCell(event);
        
        setCellMatrix(cellMatrix => {
            
            if (hoveredCell >= cellMatrix.col && hoveredCell < cellMatrix.col + cellMatrix.width) {
                const newMatrix: Uint8ClampedArray = new Uint8ClampedArray(cellMatrix.matrix);
                newMatrix[hoveredCell] = 0;
                return {
                    ...cellMatrix,
                    matrix: newMatrix
                }
            }

            return cellMatrix;
        })
    }

    onPointerMove(event: PointerEvent<Element>) {
        if (this.data.isRendering) {
            return;
        }

        const [, setCellMatrix] = this.data.boardData;
        const hoveredCell: number = this.data.getHoveredCell(event);
        const lastHoveredCell: number = this.data.lastHoveredCell;
        if (this.data.isPointerDown) {
            setCellMatrix(cellMatrix => {
                const line: number[] = range(lastHoveredCell, hoveredCell);
                const newMatrix: Uint8ClampedArray = new Uint8ClampedArray(cellMatrix.matrix);

                line.forEach(hoveredCell => {
                    if (hoveredCell >= cellMatrix.col && hoveredCell < cellMatrix.col + cellMatrix.width) {
                        newMatrix[hoveredCell] = 0;
                    }
                })

                return {
                    ...cellMatrix,
                    matrix: newMatrix
                };
            })
        }
    }

}

export default ElementaryEraseEditMode