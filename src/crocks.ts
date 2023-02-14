import {
  Async,
  constant,
  Either, identity,
  Maybe,
  maybeToAsync,
  maybeToEither,
  maybeToResult,
  Monad, Pred, Reader, Result, safe, tryCatch, UnaryFunction
} from '@bett3r-dev/crocks';
import { assoc, reduce } from 'rambda';

export const maybeToPromise = (err: any) => (safe: Maybe) =>
  new Promise((resolve, reject) => safe.either(()=>constant(reject(err)), resolve))

declare type InferPromise<T> = T extends PromiseLike<infer U> ? U : T
export const promiseToAsync = <T>(promise: Promise<InferPromise<T>>) => Async<InferPromise<T>>(( reject, resolve ) => promise.then( resolve, reject ));

export const I = identity;

declare type InferRight<T> = T extends Async<infer U> ? U : InferPromise<T>;
declare type InferLeft<T> = T extends Async<any, infer U> ? U : InferPromise<T>;
export const ensureAsync = <T>( possibleAsync?: T ): Async<InferRight<T>, InferLeft<T>> =>
  safe((x: T) => !!x, possibleAsync)
    .either(
      () => Async.of(undefined),
      (possibleAsync) => {
        if (possibleAsync.type && possibleAsync.type() === 'Async') return possibleAsync;
        else if ( !possibleAsync || !possibleAsync.then ) return Async.of(possibleAsync);
        return promiseToAsync( possibleAsync );
      }
    )

export function safeResult <R>(pred: UnaryFunction<boolean, R> | Pred<any>): (arg: R) => Result<R>
export function safeResult <R>(pred: UnaryFunction<boolean, R> | Pred<any>, arg: R): Result<R>
export function safeResult <R>(pred: UnaryFunction<boolean, R> | Pred<any>, arg?: R){
  if (arguments.length === 1) return (arg: R) => safeResult(pred, arg);
  return Result.of(safe(pred, arg))
    .chain(maybeToResult(arg))
}

export function safeEither <R>(pred: UnaryFunction<boolean, R> | Pred<any>): (arg: R) => Either<R,R>
export function safeEither <R>(pred: UnaryFunction<boolean, R> | Pred<any>, arg: R): Either<R,R>
export function safeEither <R>(pred: UnaryFunction<boolean, R> | Pred<any>, arg?: R){
  if (arguments.length === 1) return (arg: R) => safeEither(pred, arg);
  return Either.of(safe(pred, arg))
    .chain(maybeToEither(arg))
}

export function safeAsync <R>(pred: UnaryFunction<boolean, R> | Pred<R>): (arg: R) => Async<R,R>
export function safeAsync <R>(pred: UnaryFunction<boolean, R> | Pred<R>, arg: R): Async<R,R>
export function safeAsync <R>(pred: UnaryFunction<boolean, R> | Pred<R>, arg?: R){
  if (arguments.length === 1) return (arg: R) => safeAsync(pred, arg);
  return Async.of(safe(pred, arg))
    .chain(maybeToAsync(arg))
}

export function safePromise <R>(pred: UnaryFunction<boolean, R> | Pred<R>): (arg: R) => Promise<R>
export function safePromise <R>(pred: UnaryFunction<boolean, R> | Pred<R>, arg: R): Promise<R>
export function safePromise <R>(pred: UnaryFunction<boolean, R> | Pred<R>, arg?: R){
  if (arguments.length === 1) return (arg: R) => safePromise(pred, arg);
  return Promise.resolve(safe(pred, arg))
    .then(maybeToPromise(arg))
}

export function traverse<R>( destFunctor: (arg:any) => R): (transformFunction: (arg:any) => R, arrayToTraverse?: any[]) => R | (( arrayToTraverse: any[] ) => R)
export function traverse<R>( destFunctor: (arg:any) => R, transformFunction: (arg: any) => R) : ( arrayToTraverse: any[] ) => R
export function traverse<R>( destFunctor: (arg:any) => R, transformFunction: (arg: any) => R, arrayToTraverse?: any[]) : R
export function traverse<R extends { concat: Function}>( destFunctor: (arg:any) => R, transformFunction?: (arg: any) => R, arrayToTraverse?: any[]) : R | Function{
  if (!transformFunction) return (transformFunction: (arg:any) => R, arrayToTraverse?: any[] ): R| Function => traverse(destFunctor, transformFunction, arrayToTraverse);
  if (!arrayToTraverse) return ( arrayToTraverse: any[] ): R | Function => traverse(destFunctor, transformFunction, arrayToTraverse);
  return arrayToTraverse
    .reduce( ( functor, item ) =>
      functor
        .map( (traversedArray: R) => (transformedItem: any) => traversedArray.concat([transformedItem]))
        .ap(transformFunction(item)),
      destFunctor([])
    );
};

export function traverseObject<R extends {map:Function}>( destFunctor: (arg:any) => R): (transformFunction: (arg:any) => R, objOfFunctors?: object) => R | ((objOfFunctors: object ) => R)
export function traverseObject<R extends {map:Function}>( destFunctor: (arg:any) => R, transformFunction:(arg:any)=> any): ( objOfFunctors: object ) => R
export function traverseObject<R extends {map:Function}>( destFunctor: (arg:any) => R, transformFunction?:(arg:any)=> any, objOfFunctors?: object): R
export function traverseObject<R extends {map:Function}>( destFunctor: (arg:any) => R, transformFunction?:(arg:any)=> any, objOfFunctors?: object):R | Function {
  if (!transformFunction) return (transformFunction: (arg:any) => R, objOfFunctors?: any[] ): R| Function => traverseObject(destFunctor, transformFunction, objOfFunctors);
  if (!objOfFunctors) return ( objOfFunctors: any[] ): R | Function => traverseObject(destFunctor, transformFunction, objOfFunctors);
  return traverse<R>( destFunctor, transformFunction, Object.values( objOfFunctors ))
    .map((x: any[]) => (keys: string[]) =>
      reduce(( acc, curr, index )=> assoc( keys[index], curr, acc ) , {}, x)
    )
    .ap(destFunctor(Object.keys( objOfFunctors ))) ;
}

export const withEnv = <ENV, VAL, MONAD extends Monad<VAL>>(fn: (env: ENV) => (val: VAL) => MONAD) => (monad: MONAD) =>
  Reader.ask((env: ENV) => monad.chain(val=> fn(env)(val)))

type JsonParse = <T>(str:string) => Result<T>
export const jsonParse: JsonParse = tryCatch((str) => JSON.parse(str))
