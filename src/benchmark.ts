import { CellMatrix } from "common/CellMatrix";
import { Vector2 } from "common/Vector2";
import { LifeLikeBoardRenderer } from "libca/board";
import { getNextLifeGeneration } from "libca/generationFunctions";
import { isRectangularMatrix } from "common/util";

interface Benchmark {
    readonly name: string
    readonly width: number
    readonly height: number
    readonly pattern: number[][]
    readonly generations: number
}

const benchmarks: Benchmark[] = [
    {
        name: "Acorn 200x200",
        width: 200,
        height: 200,
        pattern: [[0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]],
        generations: 100
    },
    {
        name: "Acorn 100x100",
        width: 100,
        height: 100,
        pattern: [[0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]],
        generations: 100
    },
    {
        name: "Acorn 300x300",
        width: 300,
        height: 300,
        pattern: [[0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]],
        generations: 100
    },
    {
        name: "Acorn 50x50",
        width: 50,
        height: 50,
        pattern: [[0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]],
        generations: 100
    },
    {
        name: "Acorn 25x25",
        width: 25,
        height: 25,
        pattern: [[0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]],
        generations: 100
    },
    {
        name: "Acorn 10x10",
        width: 10,
        height: 10,
        pattern: [[0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]],
        generations: 100
    }
]

export function runBenchmarks() {
    benchmarks.forEach(({name, width, height, pattern, generations}) => runBenchmark(name, width, height, pattern, generations))
}

export function runBenchmark(name: string, width: number, height: number, pattern: number[][], generations: number) {
    if (!isRectangularMatrix(pattern)) {
        throw new Error("Pattern must be a rectangular matrix")
    }

    const patternHeight = pattern.length;
    const patternWidth = pattern[0].length;

    const mockBoard = Array.from({length: height}, val => new Array<number>(width).fill(0))
    const centerCol = Math.floor(width / 2);
    const centerRow = Math.floor(height / 2);

    const mockRowOffset = Math.floor(centerRow - patternHeight / 2);
    const mockColOffset = Math.floor(centerCol - patternWidth / 2);

    for (let row = 0; row < patternHeight; row++) {
        for (let col = 0; col < patternWidth; col++) {
            mockBoard[mockRowOffset + row][mockColOffset + col] = pattern[row][col]
        }
    }

    const renderer: LifeLikeBoardRenderer = LifeLikeBoardRenderer.fromNumberMatrix(mockBoard)

    console.log(`Running Benchmark ${name} boardWidth: ${width} boardHeight: ${height} generations: ${generations}`)
    console.time("libca")
    for (let i = 0; i < 500; i++) {
        renderer.next();
    }
    console.timeEnd("libca")


    console.time("current-impl")
    let cm = CellMatrix.fromNumberMatrix(mockBoard, Vector2.ZERO)

    for (let i = 0; i < 500; i++) {
        const arr = getNextLifeGeneration(cm, "B3/S23")
        cm = cm.withCellData(arr);
    }

    console.timeEnd("current-impl")


}
