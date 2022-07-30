import { IKernelRunShortcut } from 'gpu.js';
import { RefObject, useEffect, useRef } from 'react'
import { Vector2 } from '../classes/Data/Vector2';
import { View } from '../classes/Data/View'
import { getGridDrawingKernel, renderBoard, renderBoardFromMatrix, renderGrid } from '../functions/drawing';
import { useCanvasUpdater } from '../functions/useCanvasUpdater';
import { CellMatrix } from '../interfaces/CellMatrix';
import "./boarddrawing.scss"

export const BoardDrawing = ({ board, view, className }: { board: Vector2[] | CellMatrix, view: View, className?: string }) => {
  const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);

  function render() {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (canvas !== null && canvas !== undefined) {
      const context: CanvasRenderingContext2D | null = canvas.getContext('2d', { alpha: false });
      if (context !== null && context !== undefined) {
        context.fillStyle = 'rgb(60, 60, 60)'
        context.fillRect(0, 0, canvas.width, canvas.height);
        renderGrid(canvas, context, view);
        if (Array.isArray(board)) {
          renderBoard(canvas, context, view, board as Vector2[]);
        } else {
          renderBoardFromMatrix(canvas, context, view, board as CellMatrix);
        }

      }
    }
  }

  useEffect(render);
  useCanvasUpdater(canvasRef);
  
  return <canvas className={className ?? "board-drawing"} ref={canvasRef}></canvas>
}
