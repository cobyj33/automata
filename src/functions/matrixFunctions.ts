
export function isEqualNumberMatrix(first: number[][], second: number[][]) {
    if (first.length !== second.length) {
        return false;
    }

    for (let row = 0; row < first.length; row++) {
        if (first[row].length !== second[row].length) {
            return false;
        } 

        for (let col = 0; col < first.length; col++) {
            if (first[row][col] !== second[row][col]) {
                return false;
            }
        }
    }
    return true;
}

export function padMatrixSides(matrix: number[][], amount: number): number[][] {
    const newMatrix = Array.from({ length: matrix.length + (amount * 2)}, () => new Array<number>(matrix[0].length + (amount * 2)).fill(0));
    
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            newMatrix[row + amount][col + amount] = matrix[row][col];
        }
    }
    return newMatrix;
}
