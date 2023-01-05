export function isEqualArrays<T>(first: T[], second: T[]) {
    if (first.length !== second.length) {
        return false;
    }

    const firstMap: Map<T, number> = new Map<T, number>();
    
    first.forEach(value => {
        const currentValue: number | undefined = firstMap.get(value);
        if (currentValue !== undefined && currentValue !== null) {
            firstMap.set(value, currentValue + 1);
        } else {
            firstMap.set(value, 1);
        }
    });

    const secondMap: Map<T, number> = new Map<T, number>();
    second.forEach(value =>  {
        const currentValue: number | undefined = secondMap.get(value);
        if (currentValue !== undefined && currentValue !== null) {
            secondMap.set(value, currentValue + 1);
        } else {
            secondMap.set(value, 1);
        }
    })
    
    if (firstMap.keys.length !== secondMap.keys.length) {
        return false;
    }
    
    let matching: boolean = true;
    firstMap.forEach((value, key) => {
        if (secondMap.get(key) !== value) {
            matching = false;
        }
    })

    return matching;
}

export function isRectangularMatrix<T>(matrix: T[][]) {
    if (matrix.length === 0) return true;
    const width = matrix[0].length;

    for (let row = 0; row < matrix.length; row++) {
        if (matrix[row].length !== width) return false;
    }
    return true;
}

export function isValidCellMatrix(matrix: number[][]) {
    if (!isRectangularMatrix(matrix)) return false;
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


export function isInBounds(matrix: number[][], row: number, col: number) {
    if (matrix.length === 0) return false;
    if (matrix[0].length === 0) return false;
    return row >= 0 && row < matrix.length && col >= 0 && col < matrix[0].length;
}
