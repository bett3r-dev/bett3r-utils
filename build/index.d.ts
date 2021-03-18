export declare const isError: (error?: any) => boolean;
export declare const ensureArray: <T>(theArray?: T | T[]) => T[];
export declare function foldMap<T>(fn: <T>(element: any) => T): (collection: any[]) => T[];
export declare function foldMap<T>(fn: <T>(element: any) => T, collection: any[]): T[];
export declare function push<T>(value: any): (list: Array<T>) => Array<T>;
export declare function push<T>(value: any, list: Array<T>): Array<T>;
export declare function unshift<T>(value: any): (list: Array<T>) => Array<T>;
export declare function unshift<T>(value: any, list: Array<T>): Array<T>;
export declare function findAndPerform<T, V>(predicate: (element: any) => any): (iterable: Iterable<T>) => V;
export declare function findAndPerform<T, V>(predicate: (element: any) => any, iterable: Iterable<T>): V;
export interface Functor<ADT> {
    map: (fn: (arg: any) => any) => ADT;
}
export declare function traverse<ADT>(functor: (arg: any) => Functor<ADT>): (fn: (arg: any) => any, array?: any[]) => ((array: any[]) => ADT) | ADT;
export declare function traverse<ADT>(functor: (arg: any) => Functor<ADT>, fn: (arg: any) => any): (array: any[]) => ADT;
export declare function traverse<ADT>(functor: (arg: any) => Functor<ADT>, fn: (arg: any) => any, array: any[]): ADT;
declare const _default: {
    isError: (error?: any) => boolean;
    ensureArray: <T>(theArray?: T | T[]) => T[];
    foldMap: typeof foldMap;
    push: typeof push;
    unshift: typeof unshift;
    findAndPerform: typeof findAndPerform;
    traverse: typeof traverse;
};
export default _default;
//# sourceMappingURL=index.d.ts.map