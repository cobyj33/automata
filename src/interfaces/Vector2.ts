
export interface IVector2 {
    readonly row: number;
    readonly col: number;
}

export class Vector2 implements IVector2 {
    readonly row: number
    readonly col: number

    static readonly ZERO: Vector2 = new Vector2(0, 0)

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    static fromData(vector: IVector2) {
        return new Vector2(vector.row, vector.col)
    }

    static fromDimension(width: number, height: number) {
        return new Vector2(height, width)
    }

    rowcomp() {
        return new Vector2(this.row, 0)
    }

    colcomp() {
        return new Vector2(0, this.col)
    }

    isZero(): boolean {
        return this.equals(Vector2.ZERO)
    }

    length(): number {
        return getVectorLength(this)
    }

    angle(): number {
        return vector2ToAngle(this)
    }

    floor(): Vector2 {
        return new Vector2(Math.floor(this.row), Math.floor(this.col))
    }

    ceil(): Vector2 {
        return new Vector2(Math.ceil(this.row), Math.ceil(this.col))
    }

    trunc(): Vector2 {
        return new Vector2(Math.trunc(this.row), Math.trunc(this.col))
    }

    rotate(angle: number): Vector2 {
        return Vector2.fromData(rotateVector2(this, angle))
    }

    toLength(length: number): Vector2 {
        return Vector2.fromData(vector2ToLength(this, length))
    }

    scale(amount: number): Vector2 {
        return Vector2.fromData(scaleVector2(this, amount))
    }

    alterToCol(col: number): Vector2 {
        return Vector2.fromData(vector2AlterToCol(this, col))
    }

    alterToRow(row: number): Vector2 {
        return Vector2.fromData(vector2AlterToRow(this, row));
    }

    normalize(): Vector2 {
        return Vector2.fromData(vector2Normalized(this))
    }

    toString(): string {
        return vector2ToString(this)
    }

    translate(row: number, col: number): Vector2 {
        return Vector2.fromData(translateVector2(this, row, col))
    }

    int(): Vector2 {
        return Vector2.fromData(vector2Int(this))
    }

    add(other: IVector2): Vector2 {
        return Vector2.fromData(addVector2(this, other))
    }

    addcomp(row: number, col: number) {
        return this.add({ row: row, col: col })
    }

    subtract(other: IVector2): Vector2 {
        return Vector2.fromData(subtractVector2(this, other))
    }

    round(): Vector2 {
        return Vector2.fromData(roundVector2(this))
    }

    distance(other: IVector2): number {
        return distanceBetweenVector2(this, other)
    }

    midpoint(other: IVector2): Vector2 {
        return Vector2.fromData(midPointBetweenVector2(this, other))
    }

    angleBetween(other: IVector2): number {
        return angleBetweenVector2(this, other)
    }

    dot(other: IVector2): number {
        return dotProductVector2(this, other)
    }

    lerp(t: number, other: IVector2): Vector2 {
        return Vector2.fromData(lerp(t, this, other))
    }

    adjacent(): [Vector2, Vector2, Vector2, Vector2] {
        return adjacentVector2(this).map(vec => Vector2.fromData(vec)) as [Vector2, Vector2, Vector2, Vector2]
    }

    equals(other: any): boolean {
        if (typeof(other) === "object") {
            if ("row" in other && "col" in other) {
                return vector2Equals(this, other)
            }
        }
        return false
    }

    abs(): Vector2 {
        return Vector2.fromData(vector2Abs(this))
    }

    min(): number {
        return Math.min(this.row, this.col)
    }

    max(): number {
        return Math.max(this.row, this.col)
    }

    clone(): Vector2 {
        return new Vector2(this.row, this.col)
    }

    data(): IVector2 {
        return {
            row: this.row,
            col: this.col
        }
    }
}

export function adjacentVector2(vec: IVector2): [IVector2, IVector2, IVector2, IVector2] {
    const offsets: [IVector2, IVector2, IVector2, IVector2] = [ {row: 0, col: 1}, {row: 0, col: -1}, {row: 1, col: 0}, {row: -1, col: 0} ]
    return offsets.map(offset => addVector2(vec, offset)) as [IVector2, IVector2, IVector2, IVector2]
}


export function getVectorLength(vector2: IVector2): number {
    return Math.sqrt(vector2.row * vector2.row + vector2.col * vector2.col);
}

export function rotateVector2(vector: IVector2, angleInRadians: number): IVector2 {
    const newCol: number = vector.col * Math.cos(angleInRadians) + vector.row * Math.sin(angleInRadians);
    const newRow: number = -vector.col * Math.sin(angleInRadians) + vector.row * Math.cos(angleInRadians);
    return { row: newRow, col: newCol  };
}

export function vector2ToLength(vector: IVector2, length: number): IVector2 {
    if (vector.row === 0 && vector.col === 0) {
        console.error('cannot change length of 0 length vector');
    }

    return scaleVector2(vector,  length /  getVectorLength(vector));
}

export function vector2ToAngle(vector: IVector2): number {
    return Math.atan2(-vector.row, vector.col);
}

export function vector2AlterToCol(vector: IVector2, col: number): IVector2 {
    const factor: number = col / vector.col;
    return scaleVector2(vector, factor);
}

export function vector2AlterToRow(vector: IVector2, row: number): IVector2 {
    const factor: number = row / vector.row;
    return scaleVector2(vector, factor);
}

export function vector2Normalized(vector: IVector2): IVector2 {
    return vector2ToLength(vector, 1);
}

export function vector2ToString(vector: IVector2): string {
    return `IVector2: [ Row: ${vector.row}, Col: ${vector.col} Angle: ${ vector2ToAngle(vector) * 180.0 / Math.PI }]`
}

export function translateVector2(vector: IVector2, row: number, col: number): IVector2 { 
    return { row: vector.row + row, col: vector.col + col };
}

export function addVector2(vector: IVector2, other: IVector2): IVector2 {
    return { row: vector.row + other.row, col: vector.col + other.col }
}

export function vector2Int(vector: IVector2): IVector2 {
    return { row: Math.trunc(vector.row), col: Math.trunc(vector.col) }
}

export function subtractVector2(vector: IVector2, other: IVector2): IVector2 {
    return { row: vector.row - other.row, col: vector.col - other.col }
}

export function scaleVector2(vector: IVector2, scale: number): IVector2 {
    return { row: vector.row * scale, col: vector.col * scale }
}

export function roundVector2(vector: IVector2): IVector2 {
    return { row: Math.round(vector.row), col: Math.round(vector.col) }
}

export function vector2FromAngle(angleInRadians: number): IVector2 {
    return { row: -Math.sin(angleInRadians), col: Math.cos(angleInRadians) };
}

export function distanceBetweenVector2(first: IVector2, second: IVector2): number {
    return Math.sqrt( ( first.row - second.row ) * ( first.row - second.row ) + ( first.col - second.col ) * (first.col - second.col) );
}

export function midPointBetweenVector2(first: IVector2, second: IVector2): IVector2 {
   return { row: ( first.row + second.row ) / 2, col:  (first.col + second.col) / 2 }
} 

export function angleBetweenVector2(first: IVector2, second: IVector2): number {
    return Math.abs( vector2ToAngle(first) - vector2ToAngle(second));
}

export function dotProductVector2(first: IVector2, second: IVector2): number {
    const angle: number = angleBetweenVector2(first, second);
    return getVectorLength(first) * getVectorLength(second) * Math.cos(angle);
}

export function vector2Equals(vector: IVector2, other: IVector2): boolean {
    return vector.row == other.row && vector.col === other.col
}

export function lerp(t: number, first: IVector2, second: IVector2): IVector2 {
    return addVector2(first, scaleVector2( subtractVector2(second, first), t))
}

export function vector2IsInteger(vec: IVector2): boolean {
    return Number.isInteger(vec.row) && Number.isInteger(vec.col)
}

export function vector2Abs(vec: IVector2): IVector2 {
    return { row: Math.abs(vec.row), col: Math.abs(vec.col) }
}


// Program Specific
import { Set2D } from "classes/Structures/Set2D";

function vector2ListToSet2D(list: IVector2[]): Set2D {
    const set2D: Set2D = new Set2D()
    list.forEach(vec => set2D.add(vec.row, vec.col))
    return set2D;
}

function getVector2ListDuplicatesSet(list: IVector2[]): Set2D {
    const found: Set2D = new Set2D()
    const duplicates: Set2D = new Set2D()

    list.forEach(vec => {
        if (found.has(vec.row, vec.col)) {
            duplicates.add(vec.row, vec.col)
        }
        found.add(vec.row, vec.col)
        return true
    })

    return duplicates
}

export function getVector2ListDuplicates(list: IVector2[]): IVector2[] {
    return getVector2ListDuplicatesSet(list).getPairs()
}

export function filterVector2ListDuplicates(list: IVector2[]): IVector2[] {
    const set2D: Set2D = new Set2D()
    return list.filter(vec => {
        if (set2D.has(vec.row, vec.col)) {
            return false
        }
        set2D.add(vec.row, vec.col)
        return true
    })
}

export function removeVector2ListDuplicates(list: IVector2[]): IVector2[] {
    const duplicates: Set2D = getVector2ListDuplicatesSet(list)
    console.log(duplicates.getPairs())
    return list.filter(vec => !duplicates.has(vec.row, vec.col))
}

export function filterVector2ListMatches(list: IVector2[], matches: IVector2[]) {
    const set2D = Set2D.fromVector2DArray(matches)
    return list.filter(vec => set2D.has(vec.row, vec.col))
}