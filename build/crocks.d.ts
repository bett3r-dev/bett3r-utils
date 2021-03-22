import Async from 'crocks/Async';
import Either from 'crocks/Either';
export declare const promiseToAsync: (promise: Promise<any>) => Async;
export declare const ensureAsync: (possibleAsync?: any) => any;
export declare const nullableToAsync: (arg?: any) => Async;
export declare const nullableToEither: (arg?: any) => Either;
export declare const falsyToAsync: (arg?: any) => Async;
export declare const falsyToEither: (arg?: any) => Either;
export declare const readFile: import("crocks/internal").VariadicFunction<Async>;
export interface Functor<ADT> {
    map: (fn: (arg: any) => any) => ADT;
}
export declare function traverse<ADT>(functor: (arg: any) => Functor<ADT>): (fn: (arg: any) => any, array?: any[]) => ((array: any[]) => ADT) | ADT;
export declare function traverse<ADT>(functor: (arg: any) => Functor<ADT>, fn: (arg: any) => any): (array: any[]) => ADT;
export declare function traverse<ADT>(functor: (arg: any) => Functor<ADT>, fn: (arg: any) => any, array: any[]): ADT;
//# sourceMappingURL=crocks.d.ts.map