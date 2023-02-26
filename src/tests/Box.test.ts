import { Box } from "common/Box";
import { IVector2 } from "common/Vector2"

test("Equal Boxes", () => {
    const first: Box = Box.from(0, 2, 5, 4);
    const second: Box = Box.from(0, 2, 5, 4)
    expect(first.equals(second)).toBe(true)
})

test("inBox", () => {
    const cell: IVector2 = { row: 1, col: 0 };
    const box: Box = Box.from(-1, -1, 3, 3)
    expect(box.pointInside(cell)).toBe(true);
})

test('getEnclosingBox', () => {
    const box = Box.enclosed([{ row: 2, col: 0 },
        { row: 5, col: 0 },
        { row: 3, col: 1 },
        { row: 7, col: 4 },
        { row: 2, col: 2 },
        { row: 3, col: 3 },
    ])


    const expected = Box.from(2, 0, 4, 5)

    expect(box.equals(expected)).toBe(true)
})
