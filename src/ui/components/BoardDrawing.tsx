import React from 'react'
import { IVector2 } from 'interfaces/Vector2';
import { View } from 'interfaces/View'
import { RGBA, Color } from 'interfaces/Color';
import { getBoardMatrixShaderProgram, getGridShaderProgram, renderBoard, renderBoardFromMatrix, renderGrid, withCanvasAndContextWebGL2 } from 'functions/drawing';
import { useCanvasHolderUpdater, useWebGL2CanvasUpdater } from 'functions/hooks';
import { CellMatrix } from 'interfaces/CellMatrix';
import boardDrawingStyles from "ui/components/styles/BoardDrawing.module.css"
import LayeredCanvas from 'ui/components/LayeredCanvas';
import { visitIterationBody } from 'typescript';

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

interface BoardDrawingConfig {
  grid?: boolean,
  minGridSize?: number
}

export const BoardDrawing = ({ board, view, config = { grid: true, minGridSize: 4 }  }: { board: IVector2[] | CellMatrix, view: View, config?: BoardDrawingConfig }) => {
  const boardCanvasRef: React.RefObject<HTMLCanvasElement> = React.useRef<HTMLCanvasElement>(null);
  const gridCanvasRef: React.RefObject<HTMLCanvasElement> = React.useRef<HTMLCanvasElement>(null);
  const boardMatrixShaderProgram: React.MutableRefObject<WebGLShader | null> = React.useRef<WebGLShader | null>(null);
  const gridShaderProgram: React.MutableRefObject<WebGLShader | null> = React.useRef<WebGLShader | null>(null);

  const lastView = React.useRef<View>(view);

  function renderBoardCanvas() {
    withCanvasAndContextWebGL2(boardCanvasRef, ({ gl }) => {
      gl.clearColor(0.15, 0.15, 0.15, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (Array.isArray(board)) {
        renderBoard(gl, view, board as IVector2[]);
      } else {
        console.log("From board matrix")
        renderBoardFromMatrix(gl, view, board as CellMatrix, boardMatrixShaderProgram.current);
      }
    })
  }

  function clearGLCanvas(ref: React.RefObject<HTMLCanvasElement>, color: Color = new Color(0, 0, 0, 0)) {
    withCanvasAndContextWebGL2(ref, ({ gl }) => {
      gl.clearColor(...color.tuple());
      gl.clear(gl.COLOR_BUFFER_BIT);
    })
  }

  function renderGridCanvas() {
    clearGLCanvas(gridCanvasRef)
    withCanvasAndContextWebGL2(gridCanvasRef, ({ gl }) => {
      renderGrid(gl, view, gridShaderProgram.current);
    })
  }

    function shouldRenderGrid() {
      if (config?.grid) {
        if ("minGridSize" in config === true) {
          if (config.minGridSize as number <= view.cellSize) {
            return true;
          }
        } else {
          return true;
        }
      }
      return false;
    }

    function renderAll() {
        renderBoardCanvas();
        if (shouldRenderGrid()) {
          renderGridCanvas();
        } else {
          clearGLCanvas(gridCanvasRef)
        }
    }

    React.useEffect(renderBoardCanvas, [board]);

    React.useEffect(() => {
        if (!view.equals(lastView.current)) {
            lastView.current = view;
            renderAll();
        }
    }, [view]);

    const canvasHolder = React.useRef<HTMLDivElement>(null)

    useCanvasHolderUpdater(boardCanvasRef, canvasHolder, renderBoardCanvas)
    useCanvasHolderUpdater(gridCanvasRef, canvasHolder, renderGridCanvas)

    React.useEffect(() => {
      withCanvasAndContextWebGL2(boardCanvasRef, ({ gl }) => {
        boardMatrixShaderProgram.current = getBoardMatrixShaderProgram(gl);
      })

      withCanvasAndContextWebGL2(gridCanvasRef, ({ gl }) => {
        gridShaderProgram.current = getGridShaderProgram(gl);
      })

      renderAll();
    }, [])
  
  return <LayeredCanvas ref={canvasHolder}>
          <canvas className={boardDrawingStyles["board-drawing"]} ref={boardCanvasRef}></canvas>
          <canvas className={boardDrawingStyles["board-drawing"]} ref={gridCanvasRef}></canvas> 
        </LayeredCanvas> 
}

export default BoardDrawing