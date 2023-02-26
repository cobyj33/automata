import { filterVector2ListDuplicates } from "common/Vector2";
import { Vector2, IVector2, addVector2, scaleVector2, subtractVector2, rotateVector2, distanceBetweenVector2, dotProductVector2, vector2Normalized, vector2ToLength, getVectorLength } from "common/

test('vector2 addition', () => {
    const first = { row: 10, col: 5 };
    const second = { row: 12, col: 8 };
    expect(addVector2(first, second)).toMatchObject<IVector2>({ row: 22, col: 13 });
})

test('vector2 subtraction', () => {
    const first: IVector2 = {
        row: 10,
        col: 5
    }
    const second: IVector2 = {
        row: 12,
        col: 8
    }
    expect(subtractVector2(first, second)).toMatchObject<IVector2>({
        row: -2,
        col: -3
    });
})

test('vector2 scaling', () => {
    const first: IVector2 = {
        row: 10,
        col: 5
    }
    expect(scaleVector2(first, 2.5)).toMatchObject<IVector2>({
        row: 25,
        col: 12.5
    });
})

test('vector2 rotation row', () => {
    const vector = {
        row: 10,
        col: 5
    };
    expect(rotateVector2(vector, 30 * Math.PI / 180.0).row).toBeCloseTo(6.16, 2);
})

test('vector2 rotation col', () => {
    const vector = {
        row: 10,
        col: 5
    };
    expect(rotateVector2(vector, 30 * Math.PI / 180.0).col).toBeCloseTo(9.33, 2);
})

test('vector2 distance', () => {
    const first: IVector2 = {
        row: 243,
        col: -754
    };
    const second: IVector2 = {
        row: -902.4,
        col: 435.98
    }
    expect(distanceBetweenVector2(first, second)).toBeCloseTo(1651.664, 2);
})


test('vector2 toLength row', () => {
    const vector: IVector2 = {
        row: 8,
        col: 5
    }
    expect(vector2ToLength(vector, 20).row).toBeCloseTo(16.959, 2);
})

test('vector2 toLength col', () => {
    const vector: IVector2 = {
        row: 8,
        col: 5
    }
    expect(vector2ToLength(vector, 20).col).toBeCloseTo(10.599, 2);
})

test('vector2 toLength', () => {
    const vector: IVector2 = {
        row: 123,
        col: -74
    }

    expect(getVectorLength(vector2ToLength(vector, 55))).toBeCloseTo(55, 1);
})

test('vector2 length', () => {
    const vector = {
        row: 8,
        col: 5
    }

    expect(getVectorLength(vector)).toBeCloseTo(Math.sqrt(89), 2);
})

test("normalized dot product perpendicular", () => {
    const first: IVector2 = { row: 0, col: 1 }
    const second: IVector2 = { row: 1, col: 0 }
    expect(dotProductVector2(first, second)).toBeCloseTo(0, 2);
})

test("normalized dot product 45 degrees", () => {
    const first: IVector2 = { row: 0, col: 1 }
    const second = vector2Normalized({ row: 1, col: 1 })
    expect(dotProductVector2(first, second)).toBeCloseTo(Math.cos(Math.PI / 4), 2);
})

// Program Specific

test("IVector2 list remove duplicates", () => {
    const list: IVector2[] = [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 1 },
        { row: 2, col: 2 },
        { row: 3, col: 3 },
        { row: 0, col: 0 },
        { row: 4, col: 4 },
        { row: 3, col: 3 },
        { row: 5, col: 5 },
        { row: 6, col: 6 },
        { row: 8, col: 8 },
        { row: 7, col: 7 },
        { row: 5, col: 5 },
        { row: 8, col: 8 },
        { row: 9, col: 9 },
        { row: 6, col: 6 },
        { row: 0, col: 0 }
    ]

    expect(filterVector2ListDuplicates(list).length).toBe(10)
})

test("Chaning", () => {
    expect(Vector2.ZERO.withRow(5).withCol(5).equals(new Vector2(5, 5)) ).toBe(true);
})

test("Chaning Functions", () => {
    expect(Vector2.ZERO.withRow(curr => curr + 5).withCol(curr => curr + 5).equals(new Vector2(5, 5)) ).toBe(true);
})