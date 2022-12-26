import { Vector2 } from "interfaces/Vector2";
import { Box, getEnclosingBox, inBox } from "interfaces/Box";
import { CellMatrix } from 'interfaces/CellMatrix';
import { Set2D } from 'classes/Structures/Set2D';

export function cellsToCellMatrix(cells: Vector2[]): CellMatrix {
    const boundingBox: Box = getEnclosingBox(cells);
    boundingBox.width += 1;
    boundingBox.height += 1;
    const matrix: Uint8ClampedArray = new Uint8ClampedArray(boundingBox.width * boundingBox.height);


    cells.forEach(cell => matrix[(cell.row - boundingBox.row) * boundingBox.width + (cell.col - boundingBox.col)] = 1);
    return {
        row: boundingBox.row,
        col: boundingBox.col,
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

export function cellsInBoxToCellMatrix(cells: Vector2[], boundingBox: Box): CellMatrix {
    const matrix: Uint8ClampedArray = new Uint8ClampedArray(boundingBox.width * boundingBox.height);

    cells.forEach(cell => matrix[(cell.row - boundingBox.row) * boundingBox.width + (cell.col - boundingBox.col)] = 1);
    return {
        row: boundingBox.row,
        col: boundingBox.col,
        matrix: matrix,
        width: boundingBox.width,
        height: boundingBox.height
    }
}

export function cellMatrixToVector2(cellMatrix: CellMatrix): Vector2[] {
    const cells: Vector2[] = [];
    for (let row = 0; row < cellMatrix.height; row++) {
        for (let col = 0; col < cellMatrix.width; col++) {
            if (cellMatrix.matrix[row * cellMatrix.width + col] === 1) {
                cells.push({row: cellMatrix.row + row, col: cellMatrix.col + col });
            }
        }
    }

    return cells;
}

export function partition(board: Vector2[]): CellMatrix[] {
    const matrices: CellMatrix[] = [];
    const set: Set2D = new Set2D(); 
    
    const boxes: Box[] = []
    const groups: Vector2[][] = []

    board.forEach(pos => set.add(pos.row, pos.col));
    
    board.forEach(pos => {
        const selectedBoxIndex = boxes.findIndex(box => inBox(pos, box));
        if (selectedBoxIndex !== null && selectedBoxIndex !== undefined) {
            
        } else {

        }
    })

    boxes.map(box => ({
        row: box.row - 1,
        col: box.col - 1,
        width: box.width + 2,
        height: box.height + 2
    }))
    
    return matrices;
}

