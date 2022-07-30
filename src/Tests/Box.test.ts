import { Vector2 } from "../classes/Data/Vector2"
import { getEnclosingBox } from "../functions/conversions";
import { Box, inBox } from "../interfaces/Box";

test("inBox", () => {
    const cell: Vector2 = new Vector2(1, 0);
    const box: Box = {
        row: -1,
        col: -1,
        width: 3,
        height: 3,
    }
    expect(inBox(cell, box)).toBe(true);
})

test('getEnclosingBox', () => {
    const box = getEnclosingBox([new Vector2(2, 0),
        new Vector2(5, 0),
        new Vector2(3, 1),
        new Vector2(7, 4),
        new Vector2(2, 2),
        new Vector2(3, 3),
    ])

    console.log(box)

    const expected = {
        row: 2,
        col: 0,
        width: 2,
        height: 7
    }

    expect(box).toMatchObject(expected)
})
