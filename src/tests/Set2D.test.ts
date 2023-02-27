import { Set2D } from "common/Set2D"

test("2D Set duplicate test", () => {
    const set = new Set2D();
    set.add(5, 3);
    set.add(3, 2);
    set.add(5, 3);
    expect(set.length).toBe(2);
});

test("2D set length test", () => {
    const set: Set2D = new Set2D();
    set.add(10, 10);
    expect(set.length).toBe(1);
});

test("2D Set remove test", () => {
    const set: Set2D = new Set2D();
    set.add(10, 10);
    set.add(2, 4);
    set.add(3, 6);
    set.remove(10, 10);
    expect(set.length).toBe(2);
});

test("get tuples", () => {
    const set: Set2D = new Set2D();
    set.add(10, 10);
    set.add(2, 4);
    set.add(3, 6);
    set.remove(10, 10);

    const shouldBePresent: [number, number][] = [[2, 4], [3, 6]]
    console.log(set.getTuples());
    
    expect(set.getTuples().every(tuple => shouldBePresent.some(sbp => sbp[0] === tuple[0] && sbp[1] === tuple[1])) && set.getTuples().length === shouldBePresent.length).toBe(true);
})

test("2D Set get pairs", () => {
    const set: Set2D = new Set2D();
    set.add(10, 10);
    set.add(2, 4);
    set.add(3, 6);
    set.add(12, 10);
    set.add(10, 10)
    const pairs = set.getPairs();
})

test("length - unique", () => {
    const set: Set2D = new Set2D();
    set.add(2, 4);
    set.add(3, 6);
    set.add(10, 10);
    set.add(12, 10);
    set.add(10, 12)
    expect(set.length).toBe(5);
})

test("length - remove and add", () => {
    const set: Set2D = new Set2D();
    set.add(2, 4);
    set.add(3, 6);
    set.remove(2, 4);
    set.add(10, 10);
    set.add(12, 10);
    set.add(10, 12);
    set.remove(10, 10);
    expect(set.length).toBe(3);
})



test("length - double", () => {
    const set: Set2D = new Set2D();
    set.add(10, 10);
    set.add(2, 4);
    set.add(3, 6);
    set.add(12, 10);
    set.add(10, 10)
    expect(set.length).toBe(4);
})

test("clone", () => {
    const set: Set2D = new Set2D();
    set.add(10, 10);
    set.add(2, 4);
    set.add(3, 6);
    set.add(12, 10);
    set.add(10, 10)
    const second: Set2D = new Set2D(set);
    expect(second.has(10, 10) && second.has(2, 4) && second.has(3, 6) && second.has(12, 10) && second.has(10, 10)).toBe(true);

})


test("push", () => {
    const first: Set2D = new Set2D([
        [0, 0],
        [2, 0],
        [0, 2]
    ])

    const second: Set2D = new Set2D([
        [1, 1],
        [3, 0],
        [0, 3]
    ])

    first.push(second);

    expect(first.hasAll([
        [0, 0],
        [2, 0],
        [0, 2],
        [1, 1],
        [3, 0],
        [0, 3]
    ])).toBe(true)
})

test("combine - push", () => {
    const first: Set2D = new Set2D([
        [0, 0],
        [2, 0],
        [0, 2]
    ])

    const second: Set2D = new Set2D([
        [1, 1],
        [3, 0],
        [0, 3]
    ])

    const combined = first.combine(second);
    console.log(combined.getTuples(), combined.length)

    expect(combined.hasAll([
        [0, 0],
        [2, 0],
        [0, 2],
        [1, 1],
        [3, 0],
        [0, 3]
    ])).toBe(true)
})


describe("Equality", () => {

    test("equals", () => {
        const first = new Set2D()
        const second = new Set2D();

        first.add(1, 2)
        first.add(3, 4)
        first.add(5, 6)

        second.add(1, 2)
        second.add(3, 4)
        second.add(5, 6)

        expect(first.equals(second)).toBe(true);
    }) 

    test("equals - reversed check", () => {
        const first = new Set2D()
        const second = new Set2D();

        first.add(1, 2)
        first.add(3, 4)
        first.add(5, 6)

        second.add(1, 2)
        second.add(3, 4)
        second.add(5, 6)

        expect(second.equals(first)).toBe(true);
    }) 

    test("Equals, double add", () => {
        const first = new Set2D()
        const second = new Set2D();

        first.add(1, 2)
        first.add(1, 2)
        first.add(3, 4)
        first.add(5, 6)

        second.add(1, 2)
        second.add(3, 4)
        second.add(5, 6)
        second.add(5, 6)

        expect(first.equals(second)).toBe(true);
    })

    test("Equals, missing value", () => {
        const first = new Set2D()
        const second = new Set2D();

        first.add(3, 4)
        first.add(5, 6)

        second.add(1, 2)
        second.add(3, 4)
        second.add(5, 6)

        expect(first.equals(second)).toBe(false);
    })

    test("Equals, missing value - reversed check", () => {
        const first = new Set2D()
        const second = new Set2D();

        first.add(3, 4)
        first.add(5, 6)

        second.add(1, 2)
        second.add(3, 4)
        second.add(5, 6)

        expect(second.equals(first)).toBe(false);
    })

    test("equals, removal", () => {
        const first = new Set2D();
        const second = new Set2D();
        
        first.add(3, 4)
        first.add(5, 6)

        
        second.add(1, 2)

        second.add(3, 4)
        second.add(5, 6)

        second.remove(1, 2)

        expect(first.equals(second)).toBe(true);
    });

})

test("combine - single", () => {
    const first = new Set2D([[1, 2]])
    const second = new Set2D([[2, 3]])

    expect(first.combine(second).hasAllExact([
        [1, 2],
        [2, 3],
    ])).toBe(true)
})

test("combine - dupes", () => {
    const first = new Set2D([[1, 2], [3, 4]])
    const second = new Set2D([[2, 3], [3, 4]])

    expect(first.combine(second).hasAllExact([
        [1, 2],
        [2, 3],
        [3, 4]
    ])).toBe(true)
})

test("combine - multiple", () => {
    const first = new Set2D([[1, 2]])
    const second = new Set2D([[2, 3]])
    const third = new Set2D([[3, 4]])
    const fourth = new Set2D([[4, 5]])

    expect(first.combine(second, third, fourth).hasAllExact([
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5]
    ])).toBe(true)
})

test("combine - multiple - dups", () => {
    const first = new Set2D([[1, 2], [3, 4]])
    const second = new Set2D([[2, 3]])
    const third = new Set2D([[3, 4], [4, 5]])
    const fourth = new Set2D([[4, 5]])

    expect(first.combine(second, third, fourth).hasAllExact([
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5]
    ])).toBe(true)
})

test("has all exact", () => {
    const set = new Set2D();
    set.add(1, 1)
    set.add(2, 2)
    set.add(3, 3)
    expect(set.hasAllExact([
        [1, 1],
        [2, 2],
        [3, 3]
    ])).toBe(true)
})

test("has all exact - has all but does not have all exact", () => {
    const set = new Set2D();
    set.add(1, 1)
    set.add(2, 2)
    set.add(3, 3)
    expect(set.hasAll([
        [1, 1],
        [2, 2]
    ])
    && !set.hasAllExact([
        [1, 1],
        [2, 2],
    ])).toBe(true)
})

test("has all exact - has all and has all exact", () => {
    const set = new Set2D();
    set.add(1, 1)
    set.add(2, 2)
    set.add(3, 3)
    expect(set.hasAll([
        [1, 1],
        [2, 2],
        [3, 3]
    ])
    && set.hasAllExact([
        [1, 1],
        [2, 2],
        [3, 3]
    ])).toBe(true)
})


test("has all", () => {
    const set = new Set2D();
    set.add(1, 1)
    set.add(2, 2)
    set.add(3, 3)
    set.add(4, 4)
    expect(set.hasAll([
        [1, 1],
        [2, 2],
    ])).toBe(true)
})

test("From number matrix", () => {
    const matrix = [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ]

    const set = Set2D.fromNumberMatrix(matrix);
    const shouldBePresent: [number, number][] = [
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 1]
    ]

    expect(set.hasAll(shouldBePresent)).toBe(true)
})