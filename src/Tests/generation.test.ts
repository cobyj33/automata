import { isEqualNumberMatrix } from "functions/matrixFunctions";
import { CellMatrix } from "interfaces/CellMatrix";
import { getNextLifeGeneration } from "functions/generationFunctions"
import { isEqualArrays } from "functions/validation"

test('next generation 1st test', () => {
    const lifeString = "B3/S23";
    const originalMatrix = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]

    const cellMatrix: CellMatrix = {
        row: 0,
        col: 0,
        width: 9,
        height: 5,
        matrix: new Uint8ClampedArray(originalMatrix.flat())
    }

    const nextMatrix: Uint8ClampedArray = getNextLifeGeneration(cellMatrix, lifeString);

    const expectedMatrix = [
        [0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0, 0],
        [0, 1, 1, 1, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]

    console.log("got:", nextMatrix);
    console.log("expected: ", expectedMatrix);

    expect(isEqualArrays(Array.from(nextMatrix), Array.from(expectedMatrix.flat()))).toBe(true) 
}); 

test('equal matrices', () => {
    const matrix = [
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 1, 2, 1]
    ]
    
    const other = [
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 1, 2, 1]
    ]
    
    expect(isEqualNumberMatrix(matrix, other)).toBe(true)
})

test('matrix equality of non-square matrices', () => {
    const matrix = [
        [0, 1, 1, 0],
        [0, 0, 1, 1, 3, 5],
        [0, 1, 2, 1]
    ]
    
    const other = [
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 1, 2, 1]
    ]
    
    expect(isEqualNumberMatrix(matrix, other)).toBe(false)
})

test('next generation', () => {
    const lifeString = "B3/S23";
    const originalMatrix = [
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ]

    const cellMatrix: CellMatrix = {
        row: 0,
        col: 0,
        width: 3,
        height: 4,
        matrix: new Uint8ClampedArray(originalMatrix.flat())
    }

    const nextMatrix: Uint8ClampedArray = getNextLifeGeneration(cellMatrix, lifeString);
    const expectedMatrix = [
        [0, 0, 0],
        [1, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
    ]

    console.log("got:", nextMatrix);
    console.log("expected: ", expectedMatrix);

    expect(isEqualArrays(Array.from(nextMatrix).flat(), expectedMatrix.flat())).toBe(true) 
}); 
