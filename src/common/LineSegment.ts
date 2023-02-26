import { getLine } from "functions/shapes";
import { IVector2, Vector2 } from "common/Vector2"

export class LineSegment implements ILineSegment {
    readonly start: Vector2;
    readonly end: Vector2

    constructor(start: IVector2, end: IVector2) {
        this.start = Vector2.fromData(start)
        this.end = Vector2.fromData(end)
    }

    withEnd(end: IVector2): LineSegment {
        return new LineSegment(this.start, end)
    }

    withStart(start: IVector2): LineSegment {
        return new LineSegment(start, this.end)
    }
    
    static getCells(start: IVector2, end: IVector2): IVector2[] {
        return new LineSegment(start, end).cells()
    }

    static from(rowStart: number, colStart: number, rowEnd: number, colEnd: number) {
        return new LineSegment(new Vector2(rowStart, colStart), new Vector2(rowEnd, colEnd))
    }

    cells(): IVector2[] {
        return getLine(this.start, this.end)
    }


    length(): number {
        return this.start.distance(this.end)
    }
    
    transform(callbackfn: (vec: Vector2) => Vector2): LineSegment {
        return new LineSegment(callbackfn(this.start), callbackfn(this.end))
    }
}

export interface ILineSegment {
    start: IVector2;
    end: IVector2;
}
