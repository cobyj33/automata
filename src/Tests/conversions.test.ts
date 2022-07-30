import { Vector2 } from "../classes/Data/Vector2"
import { cellsToMatrix, matrixToVector2 } from "../functions/conversions"
import { isEqualNumberMatrix } from "../functions/matrixFunctions"

test('cells To Matrix', () => {

    const start: number[][] = [
        [1, 1, 0, 0, 1, 1, 1],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0],
    ]

    console.log("start: ", start);

    const finish: number[][]  = cellsToMatrix([
        new Vector2(0, 1),
        new Vector2(0, 2),
        new Vector2(2, 2),
        new Vector2(1, 4),
        new Vector2(0, 5),
        new Vector2(0, 6),
        new Vector2(0, 7),
    ])

    console.log("finish: ", finish);


    expect(isEqualNumberMatrix(finish, start)).toBe(true);
})

test('matrix to cells', () => {
    const cells: Vector2[] = matrixToVector2([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ])

    const expected = [
        new Vector2(1, 1),
        new Vector2(1, 2),
        new Vector2(3, 2),
        new Vector2(2, 4),
        new Vector2(1, 5),
        new Vector2(1, 6),
        new Vector2(1, 7),
    ]

    expect(expected.every(cell => cells.some(testCell => JSON.stringify(cell) === JSON.stringify(testCell)))).toBe(true);
})