import fs, {ReadStream} from 'fs';
import Async from 'crocks/Async';
import Either from 'crocks/Either';
import Reader from 'crocks/Reader';
import maybeToAsync from 'crocks/Async/maybeToAsync';
import maybeToEither from 'crocks/Either/maybeToEither';
import safe from 'crocks/Maybe/safe';
import { isNil } from 'crocks/predicates';
import { identity } from 'crocks/combinators';
import { assoc, compose, not, reduce } from 'rambda';
import {Monad} from 'crocks';

export const promiseToAsync = (promise: Promise<any>) => Async(( reject, resolve ) => promise.then( resolve, reject ));

export const I = identity;

declare type InferRight<T> = T extends Async<infer U> ? U : T extends PromiseLike<infer U> ? U : T;
declare type InferLeft<T> = T extends Async<any, infer U> ? U : T extends PromiseLike<any> ? Error : any;
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

export const nullableToAsync = <R,L>(arg?: any): Async<R,L> =>
  Async.of(safe(compose(not, isNil), arg))
    .chain(maybeToAsync(null))

export const nullableToEither = <L,R>(arg?: any): Either<L,R> =>
  Either.of(safe(compose(not, isNil), arg))
    .chain(maybeToEither(null))

export const readFile = Async.fromNode(fs.readFile as any);

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

export const withEnv = <ENV, VAL>(fn: (env: ENV) => (val: VAL) => Reader<VAL, ENV>) => (monad: Monad<VAL>) =>
  Reader.ask<unknown, ENV>(env => monad.chain(val=> fn(env)(val)))
