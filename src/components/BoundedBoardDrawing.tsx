import { RefObject, useEffect, useRef } from 'react'
import { Vector2 } from '../interfaces/Vector2';
import { View } from '../interfaces/View';
import { getViewArea, } from '../functions/drawing';
import { useWebGL2CanvasUpdater } from '../functions/hooks';
import { Box } from '../interfaces/Box';
import { CellMatrix } from '../interfaces/CellMatrix';
import { BoardDrawing } from './BoardDrawing'
import { LayeredCanvas } from './LayeredCanvas';

export const BoundedBoardDrawing = ({ board, view, bounds, className }: { board: Vector2[] | CellMatrix, view: View, bounds: Box, className?: string }) => {
    const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
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
      const canvas: HTMLCanvasElement | null = canvasRef.current;
      if (canvas !== null && canvas !== undefined) {
        const gl: WebGL2RenderingContext | null = canvas.getContext('webgl2');
        if (gl !== null && gl !== undefined) {
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT)
              blockOutBounds(gl)
        }
      }
    }
  
    useEffect(render);
    useWebGL2CanvasUpdater(canvasRef);
    
    return (
        <LayeredCanvas>
          <BoardDrawing board={board} view={view} className={className} />
          <canvas className={className ?? "board-drawing"} ref={canvasRef}></canvas>
        </LayeredCanvas>
    )
}
