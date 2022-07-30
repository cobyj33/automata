export interface IEqualityComparer<T> {
    equals(first: T, second: T): boolean;
}

export type IComparer<T> = (first: T, second: T) => boolean;