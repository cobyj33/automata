import { Vector2 } from "../interfaces/Vector2"
import { cellMatrixToVector2, cellsToCellMatrix } from "../functions/conversions"

function isEqualArrays<T>(first: T[], second: T[]) {
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

test('isEqualArrays', () => {
    expect(isEqualArrays([1, 2, 3, 4, 5], [1, 2, 3, 4, 5])).toBe(true);
});

test('isEqualArrays - Same Values but Reordered', () => {
    expect(isEqualArrays([1, 2, 3, 4, 5], [2, 1, 4, 3, 5])).toBe(true);
})

test('isEqualArrays - Duplicates', () => {
    expect(isEqualArrays([1, 2, 3, 4, 4], [4, 4, 3, 2, 1])).toBe(true);
})

test('cells To Matrix', () => {

    const start: number[] = [
        [1, 1, 0, 0, 1, 1, 1],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0],
    ].flatMap(row => row);

    console.log("start: ", start);

    const finish: number[]  = cellsToCellMatrix([
        { row: 0, col:  1},
        { row: 0, col:  2},
        { row: 2, col:  2},
        { row: 1, col:  4},
        { row: 0, col:  5},
        { row: 0, col:  6},
        { row: 0, col:  7},
    ]).matrix

    console.log("finish: ", finish);


    expect(isEqualArrays(start, finish)).toBe(true);
})

test('matrix to cells', () => {
    const matrix = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]

    const cells: Vector2[] = cellMatrixToVector2( {
        topLeft: { row: 0, col: 0 },
        matrix: matrix.flatMap(row => row),
        width: matrix[0].length,
        height: matrix.length
    })

    const expected = [
        { row: 1, col: 1 } ,
        { row: 1, col: 2 },
        { row: 3, col: 2 },
        { row: 2, col: 4 } ,
        { row: 1, col: 5 } ,
        { row: 1, col: 6 },
        { row: 1, col: 7 },
    ]

    expect(expected.every(cell => cells.some(testCell => JSON.stringify(cell) === JSON.stringify(testCell)))).toBe(true);
})
