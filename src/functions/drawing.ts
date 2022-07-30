import { IKernelFunctionThis, IKernelRunShortcut } from "gpu.js";
import { Vector2 } from "../classes/Data/Vector2";
import { View } from "../classes/Data/View";
import { gpu } from "../globals";
import { Box, inBox } from "../interfaces/Box";
import { CellMatrix } from "../interfaces/CellMatrix";
import { isInBounds } from "./validation";

export function getViewArea(canvas: HTMLCanvasElement, view: View): Box {
    return {
    row: view.coordinates.row,
    col: view.coordinates.col,
    width: Math.ceil(canvas.width / view.cellSize),
    height: Math.ceil(canvas.height / view.cellSize)
    } 
}

export function renderBoard(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, view: View, board: Vector2[]) {
    context.save();
    context.fillStyle = 'white';
    const viewArea: Box = getViewArea(canvas, view);
    const shownCells = board.filter(cell => inBox(cell, viewArea));
    context.beginPath();
    for (let i = 0; i < shownCells.length; i++) {
      context.rect( (shownCells[i].col - view.coordinates.col) * view.cellSize, (shownCells[i].row - view.coordinates.row) * view.cellSize, view.cellSize, view.cellSize);
    }
    context.fill();

    context.restore();
  }

  export function renderBoardFromMatrix(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, view: View, board: CellMatrix) {
    context.save();
    context.fillStyle = 'white';
    const startCoordinates = new Vector2((board.topLeft.row - view.coordinates.row) * view.cellSize, (board.topLeft.col - view.coordinates.col) * view.cellSize)
    // const viewArea: Box = getViewArea(canvas, view);
    context.beginPath();
    for (let row = 0; row < board.matrix.length; row++) {
      for (let col = 0; col < board.matrix[0].length; col++) {
          if (board.matrix[row][col] === 1) {
            context.rect(startCoordinates.col + (col * view.cellSize), startCoordinates.row + (row * view.cellSize), view.cellSize, view.cellSize);
          }
      }
    }
    context.fill();

    context.restore();
  }

// export function renderGrid(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, view: View) {
//     context.save();
//     context.lineWidth = 1;
//     context.strokeStyle = 'black';
//     context.beginPath()
//     for (let y = -view.offset().row; y <= canvas.height; y += view.cellSize) {
//       context.moveTo(0, y);
//       context.lineTo(canvas.width, y);
//     }
    
//     for (let x = -view.offset().col; x <= canvas.width; x += view.cellSize) {
//       context.moveTo(x, 0);
//       context.lineTo(x, canvas.height);
//     }

//     context.stroke();
//     context.restore();
//   }

function gridDrawingKernelFunction(this: IKernelFunctionThis, viewOffsetRow: number, viewOffsetCol: number, viewCellSize: number) {
  if ((this.thread.x - viewOffsetCol) % viewCellSize < 1 && (this.thread.x - viewOffsetCol) % viewCellSize > -1) {
    this.color(0, 0, 0, 1);
  } else if ((this.thread.y - viewOffsetRow) % viewCellSize < 1 && (this.thread.y - viewOffsetRow) % viewCellSize > -1) {
    this.color(0, 0, 0, 1);
  } else {
    this.color(0.25, 0.25, 0.25, 1);
  }
}

export function getGridDrawingKernel() {
  return gpu.createKernel(gridDrawingKernelFunction).setDynamicOutput(true).setOutput([100, 100]).setGraphical(true);
}

export function renderGrid(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, view: View) {
      context.save();
      context.lineWidth = 1;
      context.strokeStyle = 'black';
      context.beginPath()
      for (let y = -view.offset().row; y <= canvas.height; y += view.cellSize) {
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
      }
      
      for (let x = -view.offset().col; x <= canvas.width; x += view.cellSize) {
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
      }
  
      context.stroke();
      context.restore();
    }