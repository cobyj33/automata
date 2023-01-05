import React from 'react'
import { IVector2 } from 'interfaces/Vector2';
import { View } from 'interfaces/View'
import { RGBA } from 'interfaces/Color';
import { getBoardMatrixShaderProgram, getGridShaderProgram, renderBoard, renderBoardFromMatrix, renderGrid, withCanvasAndContextWebGL2 } from 'functions/drawing';
import { useWebGL2CanvasUpdater } from 'functions/hooks';
import { CellMatrix } from 'interfaces/CellMatrix';
import boardDrawingStyles from "ui/components/styles/BoardDrawing.module.css"
import LayeredCanvas from 'ui/components/LayeredCanvas';

interface DrawingSettings {
    showGrid: boolean;
    backgroundColor: RGBA;
    cellColor: RGBA;
}

const defaultBoardSettings = {
    showGrid: true,
    backgroundColor: {
        red: 60,
        blue: 60,
        green: 60,
        alpha: 255
    },

    cellColor: {
        red: 255,
        blue: 255,
        green: 255,
        alpha: 255
    }
} as const;

export const BoardDrawing = ({ board, view, className  }: { board: IVector2[] | CellMatrix, view: View, className?: string }) => {
  const boardCanvasRef: React.RefObject<HTMLCanvasElement> = React.useRef<HTMLCanvasElement>(null);
  const gridCanvasRef: React.RefObject<HTMLCanvasElement> = React.useRef<HTMLCanvasElement>(null);
  const boardMatrixShaderProgram: React.MutableRefObject<WebGLShader | null> = React.useRef<WebGLShader | null>(null);
  const gridShaderProgram: React.MutableRefObject<WebGLShader | null> = React.useRef<WebGLShader | null>(null);

  const lastView = React.useRef<View>(view);

  function renderBoardCanvas() {
    withCanvasAndContextWebGL2(boardCanvasRef, (canvas, gl) => {
      gl.clearColor(0.15, 0.15, 0.15, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (Array.isArray(board)) {
        renderBoard(gl, view, board as IVector2[]);
      } else {
        renderBoardFromMatrix(gl, view, board as CellMatrix, boardMatrixShaderProgram.current);
      }
    })
  }

    function renderGridCanvas() {
      withCanvasAndContextWebGL2(gridCanvasRef, (canvas, gl) => {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        renderGrid(gl, view, gridShaderProgram.current);
      })
    }

    function renderAll() {
        renderBoardCanvas();
        renderGridCanvas();
    }

    React.useEffect(renderBoardCanvas, [board]);

    React.useEffect(() => {
        if (!(view.row === lastView.current.row && view.col === lastView.current.col && view.cellSize === lastView.current.cellSize)) {
            lastView.current = {...view};
            renderAll();
        }
    }, [view]);

    useWebGL2CanvasUpdater(boardCanvasRef);
    useWebGL2CanvasUpdater(gridCanvasRef);

    React.useEffect(() => {
      withCanvasAndContextWebGL2(boardCanvasRef, (canvas, gl) => {
        boardMatrixShaderProgram.current = getBoardMatrixShaderProgram(gl);
      })

      withCanvasAndContextWebGL2(gridCanvasRef, (canvas, gl) => {
        gridShaderProgram.current = getGridShaderProgram(gl);
      })

      renderAll();
    }, [])
  
  return <LayeredCanvas className={boardDrawingStyles["board-background"]}>
          <canvas className={className ?? boardDrawingStyles["board-drawing"]} ref={boardCanvasRef}></canvas>
          <canvas className={className ?? boardDrawingStyles["board-drawing"]} ref={gridCanvasRef}></canvas> 
        </LayeredCanvas> 
}

export default BoardDrawing