import { IComparer } from "../interfaces/IEqualityComparer";

export function removeDuplicates<T>(list: T[]): T[] {
    const tracker = new Set<string>([])

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

export function isEqualArray<T>(first: T[], second: T[]) {
    if (first.length !== second.length) return false;

    
}

export function isEqualArrayWithComparer<T>(first: T[], second: T[], comparer: IComparer<T>) {
    if (first.length !== second.length) return false;

    for (let i = 0; i < first.length; i++) {

    }
}