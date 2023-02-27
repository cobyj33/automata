import { FreqMap2D } from "common/FreqMap2D";
import { Set2D, } from "common/Set2D";
import { IVector2 } from "common/Vector2";
import { parseLifeLikeString } from "./generationFunctions";


type LifeRuleData = { birth: Set<number>, survival: Set<number> }
function getConwayRule(): LifeRuleData {
    return {
        birth: new Set<number>([3]),
        survival: new Set<number>([2, 3])
    }
}

// export function getNextLifeGeneration(current: Set2D, ruleString: string) {
//     const liveWithLiveNeighborsMap: FreqMap2D = new FreqMap2D();
//     const rule = parseLifeLikeString(ruleString);
//     const deadToCheck: FreqMap2D = new FreqMap2D();

//     this.current.forEach(([row, col]) => {
//         for (let neighborRow = row - 1; neighborRow <= row + 1; neighborRow++) {
//             for (let neighborCol = col - 1; neighborCol <= col + 1; neighborCol++) {
//                 if (neighborRow === row && neighborCol === col) {
//                     continue;
//                 }

//                 if (this.current.has(neighborRow, neighborCol)) { // neighbor is alive
//                     liveWithLiveNeighborsMap.add(row, col);
//                 } else {
//                     deadToCheck.add(neighborRow, neighborCol)
//                 }

//             }
//         }
//     })

//     const surviving = liveWithLiveNeighborsMap.get_with_freqs_set(...this.rule.survival);
//     const birthed = deadToCheck.get_with_freqs_set(...this.rule.birth)
//     // surviving.push(birthed);

//     return surviving.combine(birthed);
// }

export class LifeLikeBoardRenderer {
    private start: Set2D;
    private current: Set2D;
    private _currentGeneration: number;
    private rule: LifeRuleData

   
    constructor(data: Set2D, rule: LifeRuleData = getConwayRule()) {
        this.start = new Set2D(data);
        this.current = new Set2D(data);
        this._currentGeneration = 0;
        this.rule = {...rule}
    }

    static fromNumberMatrix(data: number[][], rule: LifeRuleData = getConwayRule()): LifeLikeBoardRenderer {
        return new LifeLikeBoardRenderer(Set2D.fromNumberMatrix(data), rule)
    }

    next() {
        const liveWithLiveNeighborsMap: FreqMap2D = new FreqMap2D();
        const deadToCheck: FreqMap2D = new FreqMap2D();

        this.current.forEach(([row, col]) => {
            for (let neighborRow = row - 1; neighborRow <= row + 1; neighborRow++) {
                for (let neighborCol = col - 1; neighborCol <= col + 1; neighborCol++) {
                    if (neighborRow === row && neighborCol === col) {
                        continue;
                    }

                    if (this.current.has(neighborRow, neighborCol)) { // neighbor is alive
                        liveWithLiveNeighborsMap.add(row, col);
                    } else {
                        deadToCheck.add(neighborRow, neighborCol)
                    }

                }
            }
        })

        const surviving = liveWithLiveNeighborsMap.get_with_freqs_set(...this.rule.survival);
        const birthed = deadToCheck.get_with_freqs_set(...this.rule.birth)
        // surviving.push(birthed);

        this.current = surviving.combine(birthed);
        this._currentGeneration += 1;
    }

    getData() {
        return this.current.getPairs();
    }

    getSet2D() {
        return new Set2D(this.current);
    }

    get currentGeneration(): number {
        return this._currentGeneration;
    }

    restart(): void {
        this._currentGeneration = 0;
        this.current = new Set2D(this.start)
    }
}
