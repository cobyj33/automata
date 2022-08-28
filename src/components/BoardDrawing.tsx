import { MutableRefObject, RefObject, useEffect, useRef } from 'react'
import { Vector2 } from '../interfaces/Vector2';
import { View } from '../interfaces/View'
import { getBoardMatrixShaderProgram, getGridShaderProgram, renderBoard, renderBoardFromMatrix, renderGrid } from '../functions/drawing';
import { useWebGL2CanvasUpdater } from '../functions/hooks';
import { CellMatrix } from '../interfaces/CellMatrix';
import "./styles/boarddrawing.scss"
import {LayeredCanvas} from './LayeredCanvas';
import {getColorFromCSS} from '../interfaces/Color';

export const BoardDrawing = ({ board, view, className }: { board: Vector2[] | CellMatrix, view: View, className?: string }) => {
  // const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
    const boardCanvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
    const gridCanvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);

    const boardMatrixShaderProgram: MutableRefObject<WebGLShader | null> = useRef<WebGLShader | null>(null);
    const gridShaderProgram: MutableRefObject<WebGLShader | null> = useRef<WebGLShader | null>(null);


// function isCellMatrix(board: Vector2[] | CellMatrix) {
//     return !Array.isArray(board);
// }

// function isVector2Array(board: Vector2[] | CellMatrix) {
//     return Array.isArray(board);
// }

// const lastBoard = useRef<Vector2[] | CellMatrix>(board);
const lastView = useRef<View>(view);

function renderBoardCanvas() {
    const canvas: HTMLCanvasElement | null = boardCanvasRef.current;
    if (canvas !== null && canvas !== undefined) {
      const gl: WebGL2RenderingContext | null = canvas.getContext('webgl2');
      if (gl !== null && gl !== undefined) {
        const color = getColorFromCSS("gray");
        gl.clearColor(color.red / 255, color.green / 255, color.blue / 255, 1);
        gl.clearColor(0.15, 0.15, 0.15, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);

        if (Array.isArray(board)) {
          renderBoard(gl, view, board as Vector2[]);
        } else {
          renderBoardFromMatrix(gl, view, board as CellMatrix, boardMatrixShaderProgram.current);
        }

      }
    }
}

    function renderGridCanvas() {
        const canvas: HTMLCanvasElement | null = gridCanvasRef.current;
        if (canvas !== null && canvas !== undefined) {
          const gl: WebGL2RenderingContext | null = canvas.getContext('webgl2');
          if (gl !== null && gl !== undefined) {
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            renderGrid(gl, view, gridShaderProgram.current);
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

    useWebGL2CanvasUpdater(boardCanvasRef);
    useWebGL2CanvasUpdater(gridCanvasRef);

    useEffect(() => {
        if (boardCanvasRef.current !== null && boardCanvasRef.current !== undefined) {
            const gl = boardCanvasRef.current.getContext("webgl2");
            if (gl !== null && gl !== undefined) {
                boardMatrixShaderProgram.current = getBoardMatrixShaderProgram(gl);
            }
        }

        if (gridCanvasRef.current !== null && gridCanvasRef.current !== undefined) {
            const gl = gridCanvasRef.current.getContext("webgl2");
            if (gl !== null && gl !== undefined) {
                gridShaderProgram.current = getGridShaderProgram(gl);
            }
        }

        renderAll();
    }, [])
  
  return <LayeredCanvas styles="board-background">
        <canvas className={className ?? "board-drawing"} ref={boardCanvasRef}></canvas>
        <canvas className={className ?? "board-drawing"} ref={gridCanvasRef}></canvas> 
        </LayeredCanvas> 

}
