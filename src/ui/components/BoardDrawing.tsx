import React from 'react'
import { IVector2 } from 'common/Vector2';
import { View } from 'common/View'
import { getBoardMatrixShaderProgram, getGridShaderProgram, getViewArea, renderBoard, renderBoardFromMatrix, renderGrid, withCanvasAndContextWebGL2 } from 'functions/drawing';
import { useCanvasHolderUpdater, useWebGL2CanvasUpdater } from 'functions/hooks';
import { CellMatrix } from 'common/CellMatrix';
import boardDrawingStyles from "ui/components/styles/BoardDrawing.module.css"
import { IBox, Box } from 'common/Box';
import HeldCanvas from './reuse/HeldCanvas';


interface GridHideConfig {
    show: false
}
interface GridShowConfig {
    show: true
    minGridSize: number
}
type GridConfig = GridHideConfig | GridShowConfig

interface BoardDrawingProps {
    board: IVector2[] | CellMatrix
    view: View
    grid?: GridConfig
    bounds?: IBox
}

export const BoardDrawing = ({ board, view, grid: gridConfig = { show: true, minGridSize: 4 }, bounds: inputBounds = Box.MAX }: BoardDrawingProps) => {
    const canvasRef: React.RefObject<HTMLCanvasElement> = React.useRef<HTMLCanvasElement>(null);
    const boardMatrixShaderProgram: React.MutableRefObject<WebGLShader | null> = React.useRef<WebGLShader | null>(null);
    const gridShaderProgram: React.MutableRefObject<WebGLShader | null> = React.useRef<WebGLShader | null>(null);
    const bounds = Box.fromData(inputBounds)

    React.useEffect(() => {
        withCanvasAndContextWebGL2(canvasRef, ({ gl }) => {
            boardMatrixShaderProgram.current = getBoardMatrixShaderProgram(gl);
            gridShaderProgram.current = getGridShaderProgram(gl);
        })
        render();
    }, [])

    const shouldRenderGrid = () => gridConfig.show && gridConfig.minGridSize <= view.cellSize

    function blockOutBounds(gl: WebGL2RenderingContext) {
        const viewArea: Box = getViewArea(gl.canvas, view);
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor((bounds.col - viewArea.col) * view.cellSize, gl.canvas.height - (bounds.row - viewArea.row) * view.cellSize - bounds.height * view.cellSize, bounds.width * view.cellSize, bounds.height * view.cellSize);
        gl.clearColor(0.15, 0.15, 0.15, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.disable(gl.SCISSOR_TEST);
    }

    function render() {
        withCanvasAndContextWebGL2(canvasRef, ({ gl }) => {
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            blockOutBounds(gl)

            if (Array.isArray(board)) {
                renderBoard(gl, view, board as IVector2[]);
            } else {
                renderBoardFromMatrix(gl, view, board as CellMatrix, boardMatrixShaderProgram.current);
            }

            if (shouldRenderGrid()) {
                renderGrid(gl, view, gridShaderProgram.current);
            }
            
        })
    }

    React.useEffect(render);
    React.useEffect(render, [board, view]);


  return <HeldCanvas canvasRef={canvasRef} onUpdate={render} />
}

export default BoardDrawing