import { IVector2 } from 'common/Vector2';


export class Set2D {
    private map: {[key: number]: Set<number>} = {};

    constructor(values: Array<[number, number]> = []) {
       values.forEach(value => this.add(value[0], value[1])); 
    }

    static fromVector2DArray(values: IVector2[]): Set2D {
        const set2D: Set2D = new Set2D();
        values.forEach(value => set2D.add(value.row, value.col));
        return set2D
    }

    getPairs(): IVector2[] {
        return Object.entries(this.map).flatMap(entry => {
            const row: number = Number(entry[0])
            const columnSet: Set<number> = entry[1]
            return [...columnSet].map(col => ({row: row, col: col}))
        })
    }
    
    get length(): number { return Object.values(this.map).reduce( (prev, curr) => prev + curr.size, 0); } 

    add(first: number, second: number): Set2D {
        if (first in this.map) {
           this.map[first].add(second); 
        } else {
            this.map[first] = new Set<number>();
            this.map[first].add(second);
        }

        return this;
    }

    remove(first: number, second: number): Set2D {
        if (first in this.map) {
            if (this.map[first].has(second)) {
                this.map[first].delete(second);
                if (this.map[first].size === 0) {
                    delete this.map[first];
                }
            }
        }

        return this;
    }

    has(first: number, second: number): boolean {
        if (first in this.map) {
            if (this.map[first].has(second)) {
                return true;
            }
        }
        return false;
    }
}
