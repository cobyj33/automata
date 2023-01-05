import { IVector2 } from 'interfaces/Vector2';


type Map2D = {[key: number]: Set<number>}
export class Set2D {
    private map: Map2D = {};

    constructor(values: Array<[number, number]> = []) {
       values.forEach(value => this.add(value[0], value[1])); 
    }

    static fromVector2DArray(values: IVector2[]): Set2D {
        const set2D: Set2D = new Set2D();
        values.forEach(value => set2D.add(value.row, value.col));
        return set2D
    }
    
    get length(): number { return Object.values(this.map).reduce( (prev, curr) => prev + curr.size, 0); } 

    add(row: number, col: number): Set2D {
        if (row in this.map) {
           this.map[row].add(col); 
        } else {
            this.map[row] = new Set<number>();
            this.map[row].add(col);
        }

        return this;
    }

    remove(row: number, col: number): Set2D {
        if (row in this.map) {
            if (this.map[row].has(col)) {
                this.map[row].delete(col);
                if (this.map[row].size === 0) {
                    delete this.map[row];
                }
            }
        }

        return this;
    }

    has(row: number, col: number): boolean {
        if (row in this.map) {
            if (col in this.map[row]) {
                return true;
            }
        }
        return false;
    }
}
