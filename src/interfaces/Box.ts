import { filterVector2ListDuplicates, IVector2, Vector2 } from "interfaces/Vector2";
import { Dimension2D, IDimension2D } from "interfaces/Dimension";
import { LineSegment } from "interfaces/LineSegment";
import { Range, rangeIntersect } from "interfaces/Range";


export interface IBox {
    readonly topleft: IVector2
    readonly size: IDimension2D
}

export class Box implements IBox {
    readonly topleft: Vector2
    readonly size: Dimension2D
    static readonly ZERO: Box = Box.from(0, 0, 0, 0)
    static readonly MAX: Box = Box.from(-Math.sqrt(Number.MAX_VALUE) / 2 - 1, -Math.sqrt(Number.MAX_VALUE) / 2 - 1, Math.sqrt(Number.MAX_VALUE) - 1, Math.sqrt(Number.MAX_VALUE) - 1)

    constructor(topleft: IVector2, size: IDimension2D) {
        this.topleft = Vector2.fromData(topleft)
        this.size = Dimension2D.fromData(size)
    }

    static from(row: number, col: number, width: number, height: number) {
        return new Box(new Vector2(row, col), new Dimension2D(width, height))
    }

    static fromData(box: IBox) {
        return new Box(box.topleft, box.size)
    }

    static enclosed(points: IVector2[]) {
        if (points.length === 0) {
            return Box.ZERO
        }
    
        let minRow = points[0].row;
        let maxRow = points[0].row;
        let minCol = points[0].col;
        let maxCol = points[0].col;
    
        for (let i = 0; i < points.length; i++) {
            minRow = Math.min(minRow, points[i].row)
            minCol = Math.min(minCol, points[i].col)
            maxRow = Math.max(maxRow, points[i].row)
            maxCol = Math.max(maxCol, points[i].col)
        }
    
        return Box.from(minRow, minCol, Math.abs(maxCol - minCol), Math.abs(maxRow - minRow))
    }
    
    get row(): number {
        return this.topleft.row
    }

    get col(): number {
        return this.topleft.col
    }

    get width(): number {
        return this.size.width
    }

    get height(): number {
        return this.size.height
    }

    get area() {
        return this.size.area
    }

    get right(): number {
        return this.col + this.width
    }

    get left(): number {
        return this.col
    }

    get top(): number {
        return this.row
    }
    
    get bottom(): number {
        return this.row + this.height
    }

    get centerrow(): number {
        return this.row + this.height / 2
    }

    get centercol(): number {
        return this.col + this.width / 2
    }

    get center(): Vector2 {
        return new Vector2(this.centerrow, this.centercol)
    }

    get bottomright(): Vector2 {
        return new Vector2(this.bottom, this.right)
    }

    get topright(): Vector2 {
        return new Vector2(this.top, this.right)
    }

    get bottomleft(): Vector2 {
        return new Vector2(this.bottom, this.left)
    }

    translate(vector: IVector2): Box {
        return new Box(this.topleft.add(vector), this.size)
    }

    setCenter(vector: IVector2): Box {
        const topleft = Vector2.fromData(vector).subtract({ row: this.size.height / 2, col: this.size.width / 2 })
        return new Box(topleft, this.size)
    }

    expand(width: number, height: number): Box {
        return new Box(this.topleft, this.size.expand(width, height))
    }

    pointInside(vec: IVector2) {
        return vec.row >= this.top && vec.row <= this.bottom && vec.col >= this.left && vec.col <= this.right;
    }

    corners(): [Vector2, Vector2, Vector2, Vector2] {
        return [this.topleft, this.topright, this.bottomleft, this.bottomright]
    }

    trunc(): Box {
        return new Box(this.topleft.trunc(), this.size.trunc())
    }

    floor(): Box {
        return new Box(this.topleft.floor(), this.size.floor())
    }

    ceil(): Box {
        return new Box(this.topleft.ceil(), this.size.ceil())
    }

    round(): Box {
        return new Box(this.topleft.round(), this.size.round())
    }



    lines(): [LineSegment, LineSegment, LineSegment, LineSegment] {
        return [
            new LineSegment(this.topleft, this.topright),
            new LineSegment(this.topright, this.bottomright),
            new LineSegment(this.bottomright, this.bottomleft),
            new LineSegment(this.bottomleft, this.topleft),
        ];
    }

    cells(): IVector2[] {
        return filterVector2ListDuplicates(this.lines().flatMap(line => line.cells()))
    }

    boxIntersect(other: Box): boolean {
        return rangeIntersect(this.left, this.right, other.left, other.right) && rangeIntersect(this.top, this.bottom, other.top, other.bottom)
    }

    intersectingArea(other: Box): Box {
        if (this.boxIntersect(other)) {
            const row = Math.max(this.row, other.row);
            const col = Math.max(this.col, other.col);
            const width = Math.abs( col - Math.min(this.right, other.right) );
            const height = Math.abs( row - Math.min(this.bottom, other.bottom) );
    
            return Box.from(row, col, width, height)
        }
        throw new Error(`Cannot find intersecting areas of boxes that do not intersect ${this} ${other} `)
    }

    toString(): string {
        return `Box: {
            topleft: ${this.topleft}
            size: ${this.size}
        }`
    }

    equals(other: Box): Boolean {
        return this.topleft.equals(other.topleft) && this.size.equals(other.size)
    }
}