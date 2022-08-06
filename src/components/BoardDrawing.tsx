import { RefObject, useEffect, useRef } from 'react'
import { Vector2 } from '../interfaces/Vector2';
import { View } from '../interfaces/View'
import { renderBoard, renderBoardFromMatrix, renderGrid } from '../functions/drawing';
import { useCanvasUpdater } from '../functions/hooks';
import { CellMatrix } from '../interfaces/CellMatrix';
import "./styles/boarddrawing.scss"
import {LayeredCanvas} from './LayeredCanvas';

export const BoardDrawing = ({ board, view, className }: { board: Vector2[] | CellMatrix, view: View, className?: string }) => {
  const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
    const boardCanvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
    const gridCanvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);


function isCellMatrix(board: Vector2[] | CellMatrix) {
    return !Array.isArray(board);
}

function isVector2Array(board: Vector2[] | CellMatrix) {
    return Array.isArray(board);
}

    const lastBoard = useRef<Vector2[] | CellMatrix>(board);
    const lastView = useRef<View>(view);

    function renderBoardCanvas() {
        const canvas: HTMLCanvasElement | null = boardCanvasRef.current;
        if (canvas !== null && canvas !== undefined) {
          const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
          if (context !== null && context !== undefined) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'gray';
            context.fillRect(0, 0, canvas.width, canvas.height);
            if (Array.isArray(board)) {
              renderBoard(canvas, context, view, board as Vector2[]);
            } else {
              renderBoardFromMatrix(canvas, context, view, board as CellMatrix);
            }

          }
        }
    }

    function renderGridCanvas() {
        const canvas: HTMLCanvasElement | null = gridCanvasRef.current;
        if (canvas !== null && canvas !== undefined) {
          const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
          if (context !== null && context !== undefined) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            renderGrid(canvas, context, view);
          }
        }
    }

    function renderAll() {
        renderBoardCanvas();
        renderGridCanvas();
    }

    useEffect(renderBoardCanvas, [board]);

    useEffect(() => {
        if (!(view.row === lastView.current.row && view.col === lastView.current.col && view.cellSize === lastView.current.cellSize)) {
            lastView.current = {...view};
            renderAll();
        }
    }, [view]);
    useCanvasUpdater(boardCanvasRef);
    useCanvasUpdater(gridCanvasRef);

    useEffect(renderAll, [])
  
  return <LayeredCanvas styles="board-background">
        <canvas className={className ?? "board-drawing"} ref={boardCanvasRef}></canvas>
        <canvas className={className ?? "board-drawing"} ref={gridCanvasRef}></canvas> 
        </LayeredCanvas> 

}
