

export interface IRange {
    readonly start: number
    readonly end: number
}

export class Range implements IRange {
    readonly start: number
    readonly end: number

    constructor(start: number, end: number) {
        this.start = start
        this.end = end
    }

    contains(value: number) {
        return rangeContains(value, this.start, this.end)
    }

    intersectsRange(other: Range) {
        return rangeIntersect(this.start, this.end, other.start, other.end)
    }
}

export function rangeContains(value: number, lower: number, upper: number) {
    return value >= lower && value <= upper
} 

export function rangeIntersect(firstLower: number, firstUpper: number, secondLower: number, secondUpper: number) {
    return rangeContains(firstLower, secondLower, secondUpper) || rangeContains(firstUpper, secondLower, secondUpper) || rangeContains(secondLower, firstLower, firstUpper) || rangeContains(secondUpper, firstLower, firstUpper)
}
