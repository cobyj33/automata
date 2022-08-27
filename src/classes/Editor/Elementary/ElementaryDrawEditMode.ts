import { PointerEvent } from "react";
import { EditMode } from "../EditMode";
import { StatefulData } from "../../../interfaces/StatefulData"
import { CellMatrix } from "../../../interfaces/CellMatrix"

function range(first: number, second: number): number[] {
    const min: number = Math.min(first, second);
    const distance: number = Math.abs(first - second);
    return Array.from({length: distance}, (val, index) => index + min);
}

export interface ElementaryDrawData {
    boardData: StatefulData<CellMatrix>,
    getHoveredCell: (event: PointerEvent<Element>) => number,
    lastHoveredCell: number,
    isPointerDown: boolean,
}

export class ElementaryDrawEditMode extends EditMode<ElementaryDrawData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }

    onPointerDown(event: PointerEvent<Element>) {
        const [, setCellMatrix] = this.data.boardData;
        const hoveredCell = this.data.getHoveredCell(event);
        
        setCellMatrix(cellMatrix => {
            
            if (hoveredCell >= cellMatrix.col && hoveredCell < cellMatrix.col + cellMatrix.width) {
                const newMatrix: Uint8ClampedArray = new Uint8ClampedArray(cellMatrix.matrix);
                newMatrix[hoveredCell] = 1;
                return {
                    ...cellMatrix,
                    matrix: newMatrix
                }
            }

            return cellMatrix;
        })
    }

    onPointerMove(event: PointerEvent<Element>) {
        const [, setCellMatrix] = this.data.boardData;
        const hoveredCell: number = this.data.getHoveredCell(event);
        const lastHoveredCell: number = this.data.lastHoveredCell;
        if (this.data.isPointerDown) {
            setCellMatrix(cellMatrix => {
                const line: number[] = range(lastHoveredCell, hoveredCell);
                const newMatrix: Uint8ClampedArray = new Uint8ClampedArray(cellMatrix.matrix);

                line.forEach(hoveredCell => {
                    if (hoveredCell >= cellMatrix.col && hoveredCell < cellMatrix.col + cellMatrix.width) {
                        newMatrix[hoveredCell] = 1;
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
