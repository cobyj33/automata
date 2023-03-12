import { Set2D, } from "jsutil";
import { createLifeString, getLifeStringError, isValidLifeString, LifeRuleData, parseLifeLikeString } from "libca/liferule";

export class LifeLikeBoardRenderer {
    private start: Set2D;
    private current: Set2D;
    private changes: Set2D;
    private _currentGeneration: number;
    private rule: LifeRuleData = { birth: [3], survival: [2, 3] }

    // private cachedLiveWithLiveNeighborsMap: DelayedFreqMap2D = new DelayedFreqMap2D();
    // private cachedDeadToCheck: DelayedFreqMap2D = new DelayedFreqMap2D();
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
        // this.cachedDeadToCheck.full_clear();
    }

    next() {
        this.lifeLikeFreqMap2D.clear();

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
                        this.lifeLikeFreqMap2D.add(neighborRow, neighborCol, 1, 0)
                    }
                    
                }
            }
            this.lifeLikeFreqMap2D.add(row, col, neighbors, 1);
        })


        this.current = this.lifeLikeFreqMap2D.getFinal();
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

export class LifeLikeFreqMap2D {
    private survival_value_lookup: Map<number, Map<number, number>> = new Map()
    private born_value_lookup: Map<number, Map<number, number>> = new Map()

    // private survival_set: Set2D = new Set2D();
    // private born_set: Set2D = new Set2D();

    private rule: LifeRuleData;

    constructor(rule: LifeRuleData) {
        this.rule = {...rule};
    }

    clear() {
        [...this.survival_value_lookup.values()].forEach(secondMap => secondMap.clear());
        [...this.born_value_lookup.values()].forEach(secondMap => secondMap.clear());
    }

    setRule(rule: LifeRuleData) {
        this.rule = {...rule}
    }

    getFinal(): Set2D {
        const set = new Set2D();
        for (const pair of this.survival_value_lookup) {
            for (const secondPair of pair[1]) {
                const freq = secondPair[1]
                if (this.rule.survival.some(inputFreq => inputFreq === freq)) {
                    set.add(pair[0], secondPair[0]);
                }
            }
        }

        for (const pair of this.born_value_lookup) {
            for (const secondPair of pair[1]) {
                const freq = secondPair[1]
                if (this.rule.birth.some(inputFreq => inputFreq === freq)) {
                    set.add(pair[0], secondPair[0]);
                }
            }
        }

        return set;
    }

    add(row: number, col: number, freqToAdd: number, state: 0 | 1) {
        if (Number.isInteger(freqToAdd) === false) {
            throw new Error("Frequencies must be integers in FreqMap2D");
        }
        if (freqToAdd < 0) {
            throw new Error("Frequencies must be positive in FreqMap2D");
        }
        if (freqToAdd === 0) {
            return;
        }

        if (state === 0) {
            
            let secondMap: Map<number, number> | undefined;
            if (secondMap = this.born_value_lookup.get(row)) {
                let freq: number | undefined
                if (freq = secondMap.get(col)) {
                    secondMap.set(col, freq + freqToAdd);
                } else {
                    secondMap.set(col, freqToAdd)
                }
            } else {
                this.born_value_lookup.set(row, new Map<number, number>([[col, freqToAdd]]))
            }

        } else {

            let secondMap: Map<number, number> | undefined;
            if (secondMap = this.survival_value_lookup.get(row)) {
                let freq: number | undefined
                if (freq = secondMap.get(col)) {
                    secondMap.set(col, freq + freqToAdd);
                } else {
                    secondMap.set(col, freqToAdd)
                }
            } else {
                this.survival_value_lookup.set(row, new Map<number, number>([[col, freqToAdd]]))
            }

        }

    }

}