import { Vector2 } from "../classes/Data/Vector2";
import { Box, inBox } from "../interfaces/Box";
import { getEnclosingBox } from "./getEnclosingBox";
import { input } from "gpu.js";

export function cellsToMatrix(cells: Vector2[]): number[][] {
    const boundingBox: Box = getEnclosingBox(cells);
    boundingBox.width += 1;
    boundingBox.height += 1;
    const matrix : number[][] = Array.from({length: boundingBox.height}, val => new Array<number>(boundingBox.width).fill(0));
    // console.log(matrix);
    // console.log(matrix.length);
    // console.log(matrix[0].length);
    // console.log(boundingBox);
    // cells.forEach(cell => console.log(cell.row - boundingBox.row, cell.col - boundingBox.col))

    cells.forEach(cell => matrix[cell.row - boundingBox.row][cell.col - boundingBox.col] = 1)
    return matrix;
}

export function cellsInBoxToMatrix(cells: Vector2[], boundingBox: Box) {
    const matrix : number[][] = Array.from({length: boundingBox.height}, val => new Array<number>(boundingBox.width).fill(0));
    cells.forEach(cell => matrix[cell.row][cell.col] = 1)
    return matrix;
}

export function getMatrix(rows: number, cols: number): number[][] {
    return Array.from({length: rows}, val => new Array<number>(cols).fill(0));
}

export function matrixToVector2(matrix: number[][]): Vector2[] {
    const cells: Vector2[] = [];
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] == 1) {
                cells.push(new Vector2(row, col));
            }
        }
    }

    return cells;
}