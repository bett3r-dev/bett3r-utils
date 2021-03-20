export declare const ensureArray: <T>(theArray?: T | T[]) => T[];
export declare function foldMap<T>(fn: <T>(element: any) => T): (collection: any[]) => T[];
export declare function foldMap<T>(fn: <T>(element: any) => T, collection: any[]): T[];
export declare function push<T>(value: any): (list: Array<T>) => Array<T>;
export declare function push<T>(value: any, list: Array<T>): Array<T>;
export declare function unshift<T>(value: any): (list: Array<T>) => Array<T>;
export declare function unshift<T>(value: any, list: Array<T>): Array<T>;
export declare function findAndPerform<T, V>(predicate: (element: any) => any): (iterable: Iterable<T>) => V;
export declare function findAndPerform<T, V>(predicate: (element: any) => any, iterable: Iterable<T>): V;
declare const _default: {
    ensureArray: <T>(theArray?: T | T[]) => T[];
    foldMap: typeof foldMap;
    push: typeof push;
    unshift: typeof unshift;
    findAndPerform: typeof findAndPerform;
};
export default _default;
//# sourceMappingURL=arrays.d.ts.map