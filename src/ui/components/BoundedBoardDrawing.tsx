import React from 'react'
import { IVector2 } from 'interfaces/Vector2';
import { View } from 'interfaces/View';
import { getViewArea, withCanvasAndContextWebGL2, } from 'functions/drawing';
import { useCanvasHolderUpdater, useWebGL2CanvasUpdater } from 'functions/hooks';
import { Box } from 'interfaces/Box';
import { CellMatrix } from 'interfaces/CellMatrix';
import BoardDrawing from 'ui/components/BoardDrawing'
import LayeredCanvas from 'ui/components/LayeredCanvas';
import boardDrawingStyles from "ui/components/styles/BoardDrawing.module.css"


export const BoundedBoardDrawing = ({ board, view, bounds }: { board: IVector2[] | CellMatrix, view: View, bounds: Box }) => {
    const canvasRef: React.RefObject<HTMLCanvasElement> = React.useRef<HTMLCanvasElement>(null);
    function blockOutBounds(gl: WebGL2RenderingContext) {
        const viewArea: Box = getViewArea(gl.canvas, view);
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor((bounds.col - viewArea.col) * view.cellSize, gl.canvas.height - (bounds.row - viewArea.row) * view.cellSize - bounds.height * view.cellSize, bounds.width * view.cellSize, bounds.height * view.cellSize);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // context.clearRect((bounds.col - viewArea.col) * view.cellSize, (bounds.row - viewArea.row) * view.cellSize, bounds.width * view.cellSize, bounds.height * view.cellSize);
        gl.disable(gl.SCISSOR_TEST);
    }

    function render() {
      withCanvasAndContextWebGL2(canvasRef, ({ gl }) => {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT)
        blockOutBounds(gl)
      })
    }
  
    React.useEffect(render);
    const canvasHolderRef = React.useRef<HTMLDivElement>(null)
    useCanvasHolderUpdater(canvasRef, canvasHolderRef, render);
    
    return (
        <LayeredCanvas ref={canvasHolderRef}>
          <BoardDrawing board={board} view={view} />
          <canvas className={boardDrawingStyles["board-drawing"]} ref={canvasRef}></canvas>
        </LayeredCanvas>
    )
}

export default BoundedBoardDrawing