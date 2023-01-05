import { IVector2 } from "interfaces/Vector2";
import { Dimension2D, IDimension2D } from "./Dimension";
import { LineSegment } from "./LineSegment";

// export interface Box {
    
// }


export interface Box extends IVector2 {
    width: number;
    height: number;
}

export function inBox(inside: IVector2, outside: Box): boolean {
    return inside.row >= outside.row && inside.row <= outside.row + outside.height && inside.col >= outside.col && inside.col <= outside.col + outside.width;
}

export function getBoxCorners(box: Box): IVector2[] {
    return [{
        row: box.row,
        col: box.col
    }, {
        row: box.row + box.height,
        col: box.col
    }, {
        row: box.row + box.height,
        col: box.col + box.width
    }, {
        row: box.row,
        col: box.col + box.width
    }]
}

export function areBoxesIntersecting(first: Box, second: Box): boolean {
    const firstCorners: IVector2[] = getBoxCorners(first);
    if (firstCorners.some(corner => inBox(corner, second))) {
        return true;
    }
    const secondCorners: IVector2[] = getBoxCorners(second);
    if (secondCorners.some(corner => inBox(corner, second))) {
        return true;
    }
    return false;
}

export const getIntersectingArea = (() =>  {
    const emptyBox = { row: 0, col: 0, width: 0, height: 0 }

    return (first: Box, second: Box) => {
        if (!areBoxesIntersecting(first, second)) {
            console.error("Boxes ", first, " and ", second, " do not intersect: cannot find intersecting area");
            return {...emptyBox};
        }  

        const row = Math.max(first.row, second.row);
        const col = Math.max(first.col, second.col);
        const width = Math.abs( col - Math.min(first.col + first.width, second.col + second.width) );
        const height = Math.abs( row - Math.min(first.row + first.height, second.row + second.height) );
        return {
            row: row,
            col: col,
            width: width,
            height: height
        }

    }
})();


export function getEnclosingBox(cells: IVector2[]): Box {
    if (cells.length === 0) {
        return {
            row: 0,
            col: 0,
            width: 0,
            height: 0,
        }
    }

    let minRow = cells[0].row;
    let maxRow = cells[0].row;
    let minCol = cells[0].col;
    let maxCol = cells[0].col;

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].row < minRow) {
            minRow = cells[i].row;
        }
        if (cells[i].col < minCol) {
            minCol = cells[i].col;
        }
        if (cells[i].row > maxRow) {
            maxRow = cells[i].row;
        }
        if (cells[i].col > maxCol) {
            maxCol = cells[i].col;
        }
    }

    return {
        row: minRow,
        col: minCol,
        width: Math.abs(maxCol - minCol),
        height: Math.abs(maxRow - minRow)
    }
}

// export interface IBox {
//     readonly topleft: IVector2
//     readonly size: IDimension2D
// }

// export class Box implements IBox {
//     readonly topleft: Vector2
//     readonly size: Dimension2D
//     static readonly ZERO: Box = Box.from(0, 0, 0, 0)

//     constructor(topleft: Vector2, size: Dimension2D) {
//         this.topleft = topleft
//         this.size = size
//     }

//     static from(row: number, col: number, width: number, height: number) {
//         return new Box(new Vector2(row, col), new Dimension2D(width, height))
//     }

//     static enclosed(points: IVector2[]) {
//         if (points.length === 0) {
//             return Box.ZERO
//         }
    
//         let minRow = points[0].row;
//         let maxRow = points[0].row;
//         let minCol = points[0].col;
//         let maxCol = points[0].col;
    
//         for (let i = 0; i < points.length; i++) {
//             minRow = Math.min(minRow, points[i].row)
//             minCol = Math.min(minCol, points[i].col)
//             maxRow = Math.max(maxRow, points[i].row)
//             maxCol = Math.max(maxCol, points[i].col)
//         }
    
//         return Box.from(minRow, minCol, Math.abs(maxCol - minCol), Math.abs(maxRow - minRow))
//     }
    
//     get row(): number {
//         return this.topleft.row
//     }

//     get col(): number {
//         return this.topleft.col
//     }

//     get width(): number {
//         return this.size.width
//     }

//     get height(): number {
//         return this.size.height
//     }

//     get right(): number {
//         return this.col + this.width
//     }

//     get left(): number {
//         return this.col
//     }

//     get top(): number {
//         return this.row
//     }
    
//     get bottom(): number {
//         return this.row + this.height
//     }

//     get centerrow(): number {
//         return this.row + this.height / 2
//     }

//     get centercol(): number {
//         return this.col + this.width / 2
//     }

//     get center(): Vector2 {
//         return new Vector2(this.centerrow, this.centercol)
//     }

//     get bottomright(): Vector2 {
//         return new Vector2(this.bottom, this.right)
//     }

//     get topright(): Vector2 {
//         return new Vector2(this.top, this.right)
//     }

//     get bottomleft(): Vector2 {
//         return new Vector2(this.bottom, this.left)
//     }

//     pointInside(vec: IVector2) {
//         return vec.row >= this.top && vec.row <= this.bottom && vec.col >= this.left && vec.col <= this.right;
//     }

//     corners(): [Vector2, Vector2, Vector2, Vector2] {
//         return [this.topleft, this.topright, this.bottomleft, this.bottomright]
//     }

//     trunc(): Box {
//         return new Box(this.topleft.trunc(), this.size.trunc())
//     }

//     floor(): Box {
//         return new Box(this.topleft.floor(), this.size.floor())
//     }

//     ceil(): Box {
//         return new Box(this.topleft.ceil(), this.size.ceil())
//     }

//     round(): Box {
//         return new Box(this.topleft.round(), this.size.round())
//     }



//     lines(): [LineSegment, LineSegment, LineSegment, LineSegment] {
//         return [
//             new LineSegment(this.topleft, this.topright),
//             new LineSegment(this.topright, this.bottomright),
//             new LineSegment(this.bottomright, this.bottomleft),
//             new LineSegment(this.bottomleft, this.topleft),
//         ];
//     }

//     boxIntersect(other: Box) {
//         return other.corners().some(corner => this.pointInside(corner)) || this.corners().some(corner => other.pointInside(corner))
//     }
// }

// export function inBox(inside: IVector2, outside: Box): boolean {
//     return inside.row >= outside.row && inside.row <= outside.row + outside.height && inside.col >= outside.col && inside.col <= outside.col + outside.width;
// }

// export function getBoxCorners(box: Box): IVector2[] {
//     return [{
//         row: box.row,
//         col: box.col
//     }, {
//         row: box.row + box.height,
//         col: box.col
//     }, {
//         row: box.row + box.height,
//         col: box.col + box.width
//     }, {
//         row: box.row,
//         col: box.col + box.width
//     }]
// }

// export function areBoxesIntersecting(first: Box, second: Box): boolean {
//     const firstCorners: IVector2[] = getBoxCorners(first);
//     if (firstCorners.some(corner => inBox(corner, second))) {
//         return true;
//     }
//     const secondCorners: IVector2[] = getBoxCorners(second);
//     if (secondCorners.some(corner => inBox(corner, second))) {
//         return true;
//     }
//     return false;
// }

// export const getIntersectingArea = (() =>  {
//     const emptyBox = { row: 0, col: 0, width: 0, height: 0 }

//     return (first: Box, second: Box) => {
//         if (!areBoxesIntersecting(first, second)) {
//             console.error("Boxes ", first, " and ", second, " do not intersect: cannot find intersecting area");
//             return {...emptyBox};
//         }  

//         const row = Math.max(first.row, second.row);
//         const col = Math.max(first.col, second.col);
//         const width = Math.abs( col - Math.min(first.col + first.width, second.col + second.width) );
//         const height = Math.abs( row - Math.min(first.row + first.height, second.row + second.height) );
//         return {
//             row: row,
//             col: col,
//             width: width,
//             height: height
//         }

//     }
// })();


// export function getEnclosingBox(cells: IVector2[]): Box {
    
// }
