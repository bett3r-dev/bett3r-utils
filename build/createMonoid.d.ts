export interface Monoid<T> {
    (initial?: T): MonoidInstance<T>;
    '@@implements': (test: string) => boolean;
    empty: () => MonoidInstance<T>;
    type: () => string;
    '@@type': () => string;
}
export interface MonoidInstance<T> {
    valueOf: () => T;
    equals: (otherMonoid: MonoidInstance<T>) => boolean;
    concat: (otherMonoid: MonoidInstance<T>) => MonoidInstance<T>;
    empty: () => MonoidInstance<T>;
    inspect: () => string;
    [key: string]: any;
}
export declare function createMonoid<T>(name: string, empty: T, concatFn: (a: T, b: T) => T, equalFn?: (a: T, b: T) => boolean): Monoid<T>;
//# sourceMappingURL=createMonoid.d.ts.map