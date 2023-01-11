type IComparer<T> = (first: T, second: T) => boolean;

export function isEqualNumberMatrix(first: number[][], second: number[][]) {
    if (first.length !== second.length) {
        return false;
    }

    for (let row = 0; row < first.length; row++) {
        if (first[row].length !== second[row].length) {
            return false;
        } 

        for (let col = 0; col < first.length; col++) {
            if (first[row][col] !== second[row][col]) {
                return false;
            }
        }
    }
    return true;
}

export function padMatrixSides(matrix: number[][], amount: number): number[][] {
    const newMatrix = Array.from({ length: matrix.length + (amount * 2)}, () => new Array<number>(matrix[0].length + (amount * 2)).fill(0));
    
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            newMatrix[row + amount][col + amount] = matrix[row][col];
        }
    }
    return newMatrix;
}

/**
 * Generic duplicate removal function
 * Not ideal for performance, but still works in almost all cases
 * @param list A List of anything (objects, numbers, strings, booleans) except callback functions 
 * @returns A list with removed duplicates
 */
export function removeDuplicates<T>(list: T[]): T[] {
    const tracker = new Set<string>()

    return list.filter(val => {
        const stringified: string = JSON.stringify(val);
        if (tracker.has(stringified)) {
            return false;
        } else {
            tracker.add(stringified)
            return true
        }
    })
}

/**
 * Generic duplicate detection function
 * Not ideal for performance, but still works in almost all cases 
 * @param list A List of anything (objects, numbers, strings, booleans) except callback functions 
 * @returns Whether any duplicate could be found or not
 */
export function hasDuplicates<T>(list: T[]): boolean {
    const tracker = new Set<string>([])

    for (let i = 0; i < list.length; i++) {
        const stringified: string = JSON.stringify(list[i]);
        if (tracker.has(stringified)) {
            return true;
        } else {
            tracker.add(stringified)
        }
    }
    return false;
}

/**
 * Clamp a value in an interval [lower, higher], where if the number is lower than the clamp value, it will be fit to the lower value, and if the number is higher than the top clamp value, it will be fit to the highest value. If the value is in the interval [lower, higher], the value simply returns itself
 * @example clamp(4, 5, 10) => 5; clamp(20, 5, 10) => 10; clamp(7, 5, 10) => 7
 * 
 * @param value {number} The number value to be clamped
 * @param lower {number} The amount that the value will be clamped to if the value is underneath this number
 * @param higher {number} The amount that the value will be clamped to if the value is above this number
 * @returns The number clamped
 */
export function clamp(value: number, lower: number, higher: number) {
    if (higher < lower) {
        throw new Error("Cannot clamp values, \"higher\" input " + higher + " is lower than \"lower\" input " + lower)
    }
    
    return Math.min(higher, Math.max(lower, value))
}

/**
 * A wrapper function for creating a set state alias for react state in which a child object of that state can be easily changed
 * 
 * 
 * The first Generic value is the child object / value of the parent object that will be set
 * The second generic is the actual parent object that will be used as a base for the alias
 * 
 * @param setter The top level setter or setter alias for the state that this new alias will be made for
 * @param conversion A function defining how to place the passed child data back into the parent object
 * @param getPrev A function defining how to get the previous version of the aliased state from the parent (used for when functions are passed into the returned alias)
 * @returns A React Dispatch function in which acts as any other React setState function, as in it can take a new value or a function with the previous value passed in as a parameter
 */
export function createSetStateAlias<Child, Parent>(setter: React.Dispatch<React.SetStateAction<Parent>>, conversion: (parent: Parent, newChild: Child) => Parent, getPrev: (value: Parent) => Child): React.Dispatch<React.SetStateAction<Child>> {
    return (value: React.SetStateAction<Child>) => {
        setter(original =>  {
            if (typeof(value) === "function") {
                const func = value as (prevState: Child) => Child
                const prev = getPrev(original)
                const next = func(prev)
                return conversion(original, next)
            } else {
                return conversion(original, value)
            }
        })
    }
}

export function isSameNumberArray(first: number[], second: number[]) {
    if (first.length !== second.length) {
        return false;
    }
    const length = first.length

    for (let i = 0; i < length; i++) {
        if (first[i] !== second[i]) {
            return false;
        }
    }
    return true;
}

export function isEqualArrays<T>(first: T[], second: T[]) {
    if (first.length !== second.length) {
        return false;
    }

    const firstMap: Map<T, number> = new Map<T, number>();
    
    first.forEach(value => {
        const currentValue: number | undefined = firstMap.get(value);
        if (currentValue !== undefined && currentValue !== null) {
            firstMap.set(value, currentValue + 1);
        } else {
            firstMap.set(value, 1);
        }
    });

    const secondMap: Map<T, number> = new Map<T, number>();
    second.forEach(value =>  {
        const currentValue: number | undefined = secondMap.get(value);
        if (currentValue !== undefined && currentValue !== null) {
            secondMap.set(value, currentValue + 1);
        } else {
            secondMap.set(value, 1);
        }
    })
    
    if (firstMap.keys.length !== secondMap.keys.length) {
        return false;
    }
    
    let matching: boolean = true;
    firstMap.forEach((value, key) => {
        if (secondMap.get(key) !== value) {
            matching = false;
        }
    })

    return matching;
}

export function isRectangularMatrix<T>(matrix: T[][]) {
    if (matrix.length === 0) return true;
    const width = matrix[0].length;

    for (let row = 0; row < matrix.length; row++) {
        if (matrix[row].length !== width) return false;
    }
    return true;
}

export function isValidCellMatrix(matrix: number[][]) {
    if (!isRectangularMatrix(matrix)) return false;
    if (matrix.length === 0) return true;

    for (let row = 0; row < matrix.length; row++) {
        if (matrix[row][0] !== 0 || matrix[row][matrix[row].length - 1] !== 0) {
            return false;
        }
    }

    for (let col = 0; col < matrix[0].length; col++) {
        if (matrix[0][col] !== 0 || matrix[matrix.length - 1][col] !== 0) {
            return false;
        }
    }

    return true;
}


export function isInBounds(matrix: number[][], row: number, col: number) {
    if (matrix.length === 0) return false;
    if (matrix[0].length === 0) return false;
    return row >= 0 && row < matrix.length && col >= 0 && col < matrix[0].length;
}

export function concatUint8ClampedArrays(...arrays: Uint8ClampedArray[]): Uint8ClampedArray {
    const totalLength = arrays.reduce((prev, curr) => prev + curr.length, 0)
    const newArray = new Uint8ClampedArray(totalLength)

    let stepLoc = 0;
    for (let i = 0; i < arrays.length; i++) {
        newArray.set(arrays[i], stepLoc)
        stepLoc += arrays[i].length
    }
    return newArray
}