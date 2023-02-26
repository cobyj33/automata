import { HistoryStack } from "common/HistoryStack"

test("pushing array to history stack", () => {
    const history: HistoryStack<number[][]> = new HistoryStack<number[][]>();
    history.pushState([[1, 2, 3]]);
    history.pushState([[4, 5, 6]]);

    expect(history.peekLatest()).toEqual([[4, 5, 6]]);
})

test("pushing array to matrix", () => {
    let matrix: number[][] = []
    matrix = matrix.concat([[1, 2, 3]]);
    matrix = matrix.concat([[4, 5, 6]]);

    expect(matrix[matrix.length - 1]).toMatchObject([4, 5, 6]);
})