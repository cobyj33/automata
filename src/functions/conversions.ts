import { Vector2 } from "../interfaces/Vector2";
import { Box, getEnclosingBox } from "../interfaces/Box";
import { CellMatrix } from '../interfaces/CellMatrix';
import { Set2D } from '../classes/Structures/Set2D';

export function cellsToCellMatrix(cells: Vector2[]): CellMatrix {
    const boundingBox: Box = getEnclosingBox(cells);
    boundingBox.width += 1;
    boundingBox.height += 1;
    const matrix: number[] = new Array<number>(boundingBox.width * boundingBox.height).fill(0);


    cells.forEach(cell => matrix[(cell.row - boundingBox.row) * boundingBox.width + (cell.col - boundingBox.col)] = 1);
    return {
        topLeft: { row: boundingBox.row, col: boundingBox.col },
        matrix: matrix,
        width: boundingBox.width,
        height: boundingBox.height
    }
}

// export function cellsToMatrix(cells: Vector2[]): number[][] {
//     const matrix : number[][] = Array.from({length: boundingBox.height}, () => new Array<number>(boundingBox.width).fill(0));
//     // console.log(matrix);
//     // console.log(matrix.length);
//     // console.log(matrix[0].length);
//     // console.log(boundingBox);
//     // cells.forEach(cell => console.log(cell.row - boundingBox.row, cell.col - boundingBox.col))

//     cells.forEach(cell => matrix[cell.row - boundingBox.row][cell.col - boundingBox.col] = 1)
//     return matrix;
// }

export function cellsInBoxToCellMatrix(cells: Vector2[], boundingBox: Box) {
    const matrix : number[] = new Array<number>(boundingBox.width * boundingBox.height).fill(0);
    cells.forEach(cell => matrix[(cell.row - boundingBox.row) * boundingBox.width + (cell.col - boundingBox.col)] = 1);
    return {
        topLeft: { row: boundingBox.row, col: boundingBox.col },
        matrix: matrix,
        width: boundingBox.width,
        height: boundingBox.height
    }
}

export function cellMatrixToVector2(cellMatrix: CellMatrix): Vector2[] {
    const cells: Vector2[] = [];
    for (let row = 0; row < cellMatrix.height; row++) {
        for (let col = 0; col < cellMatrix.width; col++) {
            if (cellMatrix.matrix[row * cellMatrix.height + col] == 1) {
                cells.push({row: cellMatrix.topLeft.row + row, col: cellMatrix.topLeft.col + col });
            }
        }
    }

    return cells;
}

export function partition(board: Vector2[]): CellMatrix[] {
    const matrices: CellMatrix[] = [];
    const set: Set2D = new Set2D(); 

    return matrices;
}

