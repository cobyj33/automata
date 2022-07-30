import React, { RefObject, useEffect, useRef } from 'react'
import { Vector2 } from '../classes/Data/Vector2';
import { View } from '../classes/Data/View';
import { getViewArea, renderBoard, renderGrid } from '../functions/drawing';
import { useCanvasUpdater } from '../functions/useCanvasUpdater';
import { Box } from '../interfaces/Box';
import { CellMatrix } from '../interfaces/CellMatrix';
import { BoardDrawing } from './BoardDrawing'
import { LayeredCanvas } from './LayeredCanvas';

export const BoundedBoardDrawing = ({ board, view, bounds, className }: { board: Vector2[] | CellMatrix, view: View, bounds: Box, className?: string }) => {
    const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
    function blockOutBounds(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        const viewArea: Box = getViewArea(canvas, view);
        context.clearRect((bounds.col - viewArea.col) * view.cellSize, (bounds.row - viewArea.row) * view.cellSize, bounds.width * view.cellSize, bounds.height * view.cellSize);
    }

    function render() {
      const canvas: HTMLCanvasElement | null = canvasRef.current;
      if (canvas !== null && canvas !== undefined) {
        const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
        if (context !== null && context !== undefined) {
          context.fillStyle = 'black'
          context.fillRect(0, 0, canvas.width, canvas.height);
          blockOutBounds(canvas, context)
        }
      }
    }
  
    useEffect(render);
    useCanvasUpdater(canvasRef);
    
    return (
        <LayeredCanvas>
          <BoardDrawing board={board} view={view} className={className} />
          <canvas className={className ?? "board-drawing"} ref={canvasRef}></canvas>
        </LayeredCanvas>
    )
}
