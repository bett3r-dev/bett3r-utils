import Async from 'crocks/Async';
import Either from 'crocks/Either';
export declare const promiseToAsync: (promise: Promise<any>) => Async<unknown, any>;
export declare const ensureAsync: (possibleAsync?: any) => any;
export declare const nullableToAsync: <L, R>(arg?: any) => Async<L, R>;
export declare const nullableToEither: <L, R>(arg?: any) => Either<L, R>;
export declare const falsyToAsync: <L, R>(arg?: any) => Async<L, R>;
export declare const falsyToEither: <L, R>(arg?: any) => Either<L, R>;
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
//# sourceMappingURL=crocks.d.ts.map