import { IVector2, vector2Equals, Box } from "jsutil"
import { CellMatrix } from "common/CellMatrix"
import { isEqualNumberArray, isSimilarNumberArray } from "jsutil";


test('cells To Matrix', () => {

    const start: Uint8ClampedArray = new Uint8ClampedArray([
        [1, 1, 0, 0, 1, 1, 1],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0],
    ].flat());

    console.log("start: ", start);

    const finish: Uint8ClampedArray = CellMatrix.fromIVector2List([
        { row: 0, col:  1},
        { row: 0, col:  2},
        { row: 2, col:  2},
        { row: 1, col:  4},
        { row: 0, col:  5},
        { row: 0, col:  6},
        { row: 0, col:  7},
    ]).cellData

    console.log("finish: ", finish);

    expect(isEqualNumberArray(Array.from(start), Array.from(finish))).toBe(true);
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

    const cells: IVector2[] = new CellMatrix(new Uint8ClampedArray(matrix), Box.from(0, 0, WIDTH, HEIGHT)).toVector2List()

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
        return cells.some(otherCell => vector2Equals(cell, otherCell))
    }) && expected.length === cells.length;
    console.log(expected, cells)

    expect(passed).toBe(true);
})
