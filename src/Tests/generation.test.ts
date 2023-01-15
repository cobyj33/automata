import { isEqualNumberArray, isEqualNumberMatrix, isSimilarNumberArray } from "functions/util";
import { CellMatrix } from "interfaces/CellMatrix";
import { getNextLifeGeneration } from "functions/generationFunctions"
import { Vector2 } from "interfaces/Vector2";
import { Box } from "interfaces/Box";

/**
 * Get a Acorn Conway's Game Of Life Pattern
 * The Pattern has a width of 9 and a height of 5
 * 
 * @returns A number matrix representing an acorn pattern
 */
function getAcorn(): number[][] {
    return [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
}

/**
 * Get the second generation of the Acorn Conway's Game Of Life Pattern
 * The Pattern has a width of 9 and a height of 5
 * 
 * @returns A number matrix representing an acorn pattern's second generation
 */
function getAcornNext(): number[][] {
    return [
        [0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0, 0],
        [0, 1, 1, 1, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
}

test("Cell Matrix from Number Matrix Dimensions", () => {
    const originalMatrix = getAcorn()
    const cellMatrix: CellMatrix = CellMatrix.fromNumberMatrix(originalMatrix, Vector2.ZERO)
    expect(cellMatrix.width === 9 && cellMatrix.height === 5).toBe(true)
})

test('next generation 1st test', () => {
    const lifeString = "B3/S23";
    const originalMatrix = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]

    const cellMatrix: CellMatrix = CellMatrix.fromNumberMatrix(originalMatrix, Vector2.ZERO)
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

    expect(isEqualNumberArray(Array.from(nextMatrix), Array.from(expectedMatrix.flat()))).toBe(true) 
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

    const originalCellData: Uint8ClampedArray = new Uint8ClampedArray(originalMatrix.flat())
    const cellMatrix: CellMatrix = new CellMatrix(originalCellData, Box.from(0, 0, 3, 4))

    const nextMatrix: Uint8ClampedArray = getNextLifeGeneration(cellMatrix, lifeString);
    const expectedMatrix = [
        [0, 0, 0],
        [1, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
    ]

    console.log("got:", nextMatrix);
    console.log("expected: ", expectedMatrix);

    expect(isEqualNumberArray(Array.from(nextMatrix).flat(), expectedMatrix.flat())).toBe(true) 
}); 
