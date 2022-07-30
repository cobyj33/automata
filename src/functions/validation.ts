
export function isValidCellMatrix(matrix: number[][]) {
    if (!isValidMatrix(matrix)) return false;
    if (matrix.length === 0) return true;

    for (let row = 0; row < matrix.length; row++) {
        if (matrix[row][0] !== 0 || matrix[row][matrix[row].length - 1] !== 0) {
            return false;
        }
    }

    for (let col = 0; col < matrix[0].length; col++) {
        if (matrix[0][col] !== 0 || matrix[matrix.length - 1][col] !== 0) {
            return false;
        }
    }

    return true;
}

export function isValidMatrix(matrix: number[][]) {
    if (matrix.length === 0) return true;
    const width = matrix[0].length;

    for (let row = 0; row < matrix.length; row++) {
        if (matrix[row].length !== width) return false;
    }
    return true;
}

export function isInBounds(matrix: number[][], row: number, col: number) {
    if (matrix.length === 0) return false;
    if (matrix[0].length === 0) return false;
    return row >= 0 && row < matrix.length && col >= 0 && col < matrix[0].length;
}