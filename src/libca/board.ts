import { DelayedFreqMap2D, FreqMap2D, LifeLikeFreqMap2D } from "common/FreqMap2D";
import { Set2D, } from "common/Set2D";
import { IVector2 } from "common/Vector2";
import { createLifeString, getLifeStringError, isValidLifeString, LifeRuleData, parseLifeLikeString } from "libca/liferule";






export class LifeLikeBoardRenderer {
    private start: Set2D;
    private current: Set2D;
    private changes: Set2D;
    private _currentGeneration: number;
    private rule: LifeRuleData = { birth: [3], survival: [2, 3] }

    private cachedLiveWithLiveNeighborsMap: DelayedFreqMap2D = new DelayedFreqMap2D();
    private cachedDeadToCheck: DelayedFreqMap2D = new DelayedFreqMap2D();
    private lifeLikeFreqMap2D: LifeLikeFreqMap2D;

   
    constructor(data: Set2D, rule: string | LifeRuleData) {
        this.start = new Set2D(data);
        this.current = new Set2D(data);
        this.changes = new Set2D();
        this._currentGeneration = 0;

        if (typeof(rule) === "string") {
            if (isValidLifeString(rule)) {
                this.rule = parseLifeLikeString(rule);
            } else {
                throw new Error(`Passed invalid Life Rule String ${rule} to LifeLikeBoardRenderer constructor: ${getLifeStringError(rule)}`);
            }
        } else {
            this.rule = rule;
        }

        this.lifeLikeFreqMap2D = new LifeLikeFreqMap2D(this.rule)
    }

    getRuleString(): string {
        return createLifeString(this.rule.birth, this.rule.survival);
    }

    setRule(rule: string | LifeRuleData): void {
        if (typeof(rule) === "string") {
            if (isValidLifeString(rule)) {
                rule = parseLifeLikeString(rule);
            } else {
                throw new Error(`Passed invalid Life Rule String ${rule} to LifeLikeBoardRenderer constructor: ${getLifeStringError(rule)}`);
            }
        }

        this.rule = rule
    }

    static fromNumberMatrix(data: number[][], rule: string | LifeRuleData): LifeLikeBoardRenderer {
        return new LifeLikeBoardRenderer(Set2D.fromNumberMatrix(data), rule)
    }

    setStart(start: Set2D) {
        this.cachedDeadToCheck.full_clear();
    }

    next() {
        this.cachedLiveWithLiveNeighborsMap.clear();
        this.cachedDeadToCheck.clear();

        this.current.forEach(([row, col]) => {
            let neighbors = 0;
            for (let neighborRow = row - 1; neighborRow <= row + 1; neighborRow++) {
                for (let neighborCol = col - 1; neighborCol <= col + 1; neighborCol++) {
                    if (neighborRow === row && neighborCol === col) {
                        continue;
                    }

                    if (this.current.has(neighborRow, neighborCol)) { // neighbor is alive
                        neighbors++;
                    } else {
                        if (this.cachedDeadToCheck.get_freq(row, col) < 8) {
                            this.cachedDeadToCheck.add(neighborRow, neighborCol)
                        }
                    }
                    
                }
            }
            this.cachedLiveWithLiveNeighborsMap.add(row, col, neighbors);
        })


        const surviving = this.cachedLiveWithLiveNeighborsMap.get_with_freqs_set_direct(...this.rule.survival);
        const birthed = this.cachedDeadToCheck.get_with_freqs_set_direct(...this.rule.birth)

        this.current = surviving.combine(birthed);
        this._currentGeneration += 1;
    }

    getPairs() {
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
