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

test("2D Set get pairs", () => {
    const set: Set2D = new Set2D();
    set.add(10, 10);
    set.add(2, 4);
    set.add(3, 6);
    set.add(12, 10);
    set.add(10, 10)
    const pairs = set.getPairs();
    

})


