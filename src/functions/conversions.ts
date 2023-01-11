import { IVector2 } from "interfaces/Vector2";
import { Box} from "interfaces/Box";
import { CellMatrix } from 'interfaces/CellMatrix';
import { Set2D } from 'classes/Structures/Set2D';

export function cellsToCellMatrix(cells: IVector2[]): CellMatrix {
    const boundingBox: Box = Box.enclosed(cells).expand(1, 1);
    return cellsInBoxToCellMatrix(cells, boundingBox)
}

// export function cellsToMatrix(cells: IVector2[]): number[][] {
//     const matrix : number[][] = Array.from({length: boundingBox.height}, () => new Array<number>(boundingBox.width).fill(0));
//     // console.log(matrix);
//     // console.log(matrix.length);
//     // console.log(matrix[0].length);
//     // console.log(boundingBox);
//     // cells.forEach(cell => console.log(cell.row - boundingBox.row, cell.col - boundingBox.col))

//     cells.forEach(cell => matrix[cell.row - boundingBox.row][cell.col - boundingBox.col] = 1)
//     return matrix;
// }

export function cellsInBoxToCellMatrix(cells: IVector2[], boundingBox: Box): CellMatrix {
    const matrix: Uint8ClampedArray = new Uint8ClampedArray(boundingBox.width * boundingBox.height);
    cells.forEach(cell => matrix[(cell.row - boundingBox.row) * boundingBox.width + (cell.col - boundingBox.col)] = 1);
    return new CellMatrix(matrix, boundingBox)
}

export function cellMatrixToVector2(cellMatrix: CellMatrix): IVector2[] {
    const cells: IVector2[] = [];
    cellMatrix.forEach((row, col) => {
        if (cellMatrix.at(row, col) === 1) {
            cells.push({row: cellMatrix.row + row, col: cellMatrix.col + col });
        }
    })

    return cells;
}

export function partition(board: IVector2[]): CellMatrix[] {
    const matrices: CellMatrix[] = [];
    const set: Set2D = new Set2D(); 
    
    const boxes: Box[] = []
    const groups: IVector2[][] = []

    board.forEach(pos => set.add(pos.row, pos.col));
    
    board.forEach(pos => {
        const selectedBoxIndex = boxes.findIndex(box => box.pointInside(pos));
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

