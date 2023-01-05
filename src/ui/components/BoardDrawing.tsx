import React from 'react'
import { IVector2 } from 'interfaces/Vector2';
import { View } from 'interfaces/View'
import { Color } from 'interfaces/Color';
import { getBoardMatrixShaderProgram, getGridShaderProgram, renderBoard, renderBoardFromMatrix, renderGrid } from 'functions/drawing';
import { useWebGL2CanvasUpdater } from 'functions/hooks';
import { CellMatrix } from 'interfaces/CellMatrix';
import boardDrawingStyles from "ui/components/styles/BoardDrawing.module.css"
import LayeredCanvas from 'ui/components/LayeredCanvas';
import {getColorFromCSS} from 'interfaces/Color';

interface DrawingSettings {
    showGrid: boolean;
    backgroundColor: Color;
    cellColor: Color;
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

  function getCanvasAndGL(ref: React.RefObject<HTMLCanvasElement>): [canvas: HTMLCanvasElement,  gl: WebGL2RenderingContext] {
    const canvas: HTMLCanvasElement | null = ref.current;
      if (canvas !== null && canvas !== undefined) {
        const gl: WebGL2RenderingContext | null = canvas.getContext('webgl2');
        if (gl !== null && gl !== undefined) {
          return [canvas, gl]
        }
        throw new Error("Could not fetch WebGL Rendering Context")
      }
      throw new Error("Could not fetch HTML Canvas")
  }

  function renderBoardCanvas() {
      try {
        const [_, gl] = getCanvasAndGL(boardCanvasRef)
        gl.clearColor(0.15, 0.15, 0.15, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (Array.isArray(board)) {
          renderBoard(gl, view, board as IVector2[]);
        } else {
          renderBoardFromMatrix(gl, view, board as CellMatrix, boardMatrixShaderProgram.current);
        }
        
      } catch(error) {
        console.error(error)
      }
  }

    function renderGridCanvas() {
      try {
        const [_, gl] = getCanvasAndGL(gridCanvasRef)
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        renderGrid(gl, view, gridShaderProgram.current);
      } catch (err) {
        console.error(err)
      }
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
      try {
        const [_, gl] = getCanvasAndGL(boardCanvasRef)
        boardMatrixShaderProgram.current = getBoardMatrixShaderProgram(gl);
      } catch(error) {
        console.error(error)
      }

      try {
        const [_, gl] = getCanvasAndGL(gridCanvasRef)
        gridShaderProgram.current = getGridShaderProgram(gl);
      } catch(error) {
        console.error(error)
      }

      renderAll();
    }, [])
  
  return <LayeredCanvas className={boardDrawingStyles["board-background"]}>
          <canvas className={className ?? boardDrawingStyles["board-drawing"]} ref={boardCanvasRef}></canvas>
          <canvas className={className ?? boardDrawingStyles["board-drawing"]} ref={gridCanvasRef}></canvas> 
        </LayeredCanvas> 
}

export default BoardDrawing