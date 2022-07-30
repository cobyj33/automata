import { getNextConwayGenerationFunction } from "../classes/Automata/Conway";
import { isEqualNumberMatrix } from "../functions/matrixFunctions";
import { gpu } from "../globals";

test('next generation acorn', () => {
    const nextGenerationKernel = gpu.createKernel(getNextConwayGenerationFunction).setOutput([9, 5])
    const originalMatrix = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]

    const nextMatrix = nextGenerationKernel(originalMatrix, 9, 5) as number[][];
    const expectedMatrix = [
        [0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0, 0],
        [0, 1, 1, 1, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]

    console.log("got:", nextMatrix);
    console.log("expected: ", expectedMatrix);

    expect(isEqualNumberMatrix(nextMatrix, expectedMatrix)).toBe(true) 
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
    const nextGenerationKernel = gpu.createKernel(getNextConwayGenerationFunction).setOutput([3, 4])
    const originalMatrix = [
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ]

    const nextMatrix = nextGenerationKernel(originalMatrix, 3, 4) as number[][];
    const expectedMatrix = [
        [0, 0, 0],
        [1, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
    ]

    console.log("got:", nextMatrix);
    console.log("expected: ", expectedMatrix);

    expect(isEqualNumberMatrix(nextMatrix, expectedMatrix)).toBe(true) 
}); 
