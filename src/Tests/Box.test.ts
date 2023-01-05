import { Box, inBox, getEnclosingBox } from "interfaces/Box";
import { IVector2 } from "interfaces/Vector2"

test("inBox", () => {
    const cell: IVector2 = { row: 1, col: 0 };
    const box: Box = {
        row: -1,
        col: -1,
        width: 3,
        height: 3,
    }
    expect(inBox(cell, box)).toBe(true);
})

test('getEnclosingBox', () => {
    const box = getEnclosingBox([{ row: 2, col: 0 },
        { row: 5, col: 0 },
        { row: 3, col: 1 },
        { row: 7, col: 4 },
        { row: 2, col: 2 },
        { row: 3, col: 3 },
    ])


    const expected = {
        row: 2,
        col: 0,
        width: 4,
        height: 5
    }

    expect(box).toMatchObject(expected)
})
