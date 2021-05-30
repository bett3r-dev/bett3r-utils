import Async from 'crocks/Async';
import Either from 'crocks/Either';
import { identity } from 'crocks/combinators';
export declare const promiseToAsync: (promise: Promise<any>) => Async<unknown, any>;
export declare const I: typeof identity;
declare type InferRight<T> = T extends Async<any, infer U> ? U : T extends PromiseLike<infer U> ? U : T;
declare type InferLeft<T> = T extends Async<infer U, any> ? U : T extends PromiseLike<any> ? Error : any;
export declare const ensureAsync: <T>(possibleAsync?: T | undefined) => Async<InferLeft<T>, InferRight<T>>;
export declare const nullableToAsync: <L, R>(arg?: any) => Async<L, R>;
export declare const nullableToEither: <L, R>(arg?: any) => Either<L, R>;
export declare const readFile: import("crocks/internal").VariadicFunction<Async<any, any>>;
export declare function traverse<R>(destFunctor: (arg: any) => R): (transformFunction: (arg: any) => R, arrayToTraverse?: any[]) => R | ((arrayToTraverse: any[]) => R);
export declare function traverse<R>(destFunctor: (arg: any) => R, transformFunction: (arg: any) => R): (arrayToTraverse: any[]) => R;
export declare function traverse<R>(destFunctor: (arg: any) => R, transformFunction: (arg: any) => R, arrayToTraverse?: any[]): R;
export declare function traverseObject<R extends {
    map: Function;
}>(destFunctor: (arg: any) => R): (transformFunction: (arg: any) => R, objOfFunctors?: object) => R | ((objOfFunctors: object) => R);
export declare function traverseObject<R extends {
    map: Function;
}>(destFunctor: (arg: any) => R, transformFunction: (arg: any) => any): (objOfFunctors: object) => R;
export declare function traverseObject<R extends {
    map: Function;
}>(destFunctor: (arg: any) => R, transformFunction?: (arg: any) => any, objOfFunctors?: object): R;
export {};
//# sourceMappingURL=crocks.d.ts.map