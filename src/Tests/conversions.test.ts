import { Vector2 } from "interfaces/Vector2"
import { cellMatrixToVector2, cellsToCellMatrix } from "functions/conversions"
import { isEqualArrays } from "functions/validation"


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

    const start: Uint8ClampedArray = new Uint8ClampedArray([
        [1, 1, 0, 0, 1, 1, 1],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0],
    ].flat());

    console.log("start: ", start);

    const finish: Uint8ClampedArray = cellsToCellMatrix([
        { row: 0, col:  1},
        { row: 0, col:  2},
        { row: 2, col:  2},
        { row: 1, col:  4},
        { row: 0, col:  5},
        { row: 0, col:  6},
        { row: 0, col:  7},
    ]).matrix

    console.log("finish: ", finish);

    expect(isEqualArrays(Array.from(start), Array.from(finish))).toBe(true);
})

test('matrix to cells', () => {
    const WIDTH = 9
    const HEIGHT = 5
    const matrix = [
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 0, 0, 1, 1, 1, 0,
        0, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    const cells: Vector2[] = cellMatrixToVector2( {
        row: 0,
        col: 0,
        matrix: new Uint8ClampedArray(matrix),
        width: WIDTH,
        height: HEIGHT
    })

    const expected = [
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        { row: 3, col: 2 },
        { row: 2, col: 4 },
        { row: 1, col: 5 },
        { row: 1, col: 6 },
        { row: 1, col: 7 },
    ]

    const passed = expected.every(cell => {
        return cells.some(otherCell => cell.col === otherCell.col && cell.row === otherCell.row)
    }) && expected.length === cells.length;
    console.log(expected, cells)

    expect(passed).toBe(true);
})
