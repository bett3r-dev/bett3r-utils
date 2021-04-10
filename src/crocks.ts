import fs from 'fs';
import Async from 'crocks/Async';
import Either from 'crocks/Either';
import maybeToAsync from 'crocks/Async/maybeToAsync';
import maybeToEither from 'crocks/Either/maybeToEither';
import safe from 'crocks/Maybe/safe';
import { isNil, isTruthy } from 'crocks';
import { assoc, compose, not, reduce } from 'rambda';
import { Functor } from 'crocks/internal';

export const promiseToAsync = (promise: Promise<any>) => Async(( reject, resolve ) => promise.then( resolve, reject ));

export const ensureAsync = ( possibleAsync?: any ) =>
  possibleAsync?.type && possibleAsync.type() === 'Async' ? possibleAsync :
    (( !possibleAsync || !possibleAsync.then ) ? Async.of(possibleAsync) : promiseToAsync( possibleAsync ));

export const nullableToAsync = <L,R>(arg?: any): Async<L,R> =>
  Async.of(safe(compose(not, isNil), arg))
    .chain(maybeToAsync(null))

export const nullableToEither = <L,R>(arg?: any): Either<L,R> =>
  Either.of(safe(compose(not, isNil), arg))
    .chain(maybeToEither(null))

export const falsyToAsync = <L,R>(arg?: any) : Async<L,R> =>
  Async.of(safe(isTruthy, arg))
    .chain(maybeToAsync(false))

export const falsyToEither = <L,R>(arg?: any) : Either<L,R> =>
  Either.of(safe(isTruthy, arg))
    .chain(maybeToEither(false))

export const readFile = Async.fromNode(fs.readFile as any);

export function traverse<R>( destFunctor: (arg:any) => R): (transformFunction: (arg:any) => R, arrayToTraverse?: any[]) => R | (( arrayToTraverse: any[] ) => R)
export function traverse<R>( destFunctor: (arg:any) => R, transformFunction: (arg: any) => R) : ( arrayToTraverse: any[] ) => R
export function traverse<R>( destFunctor: (arg:any) => R, transformFunction: (arg: any) => R, arrayToTraverse: any[]) : R
export function traverse<R>( destFunctor: (arg:any) => R, transformFunction?: (arg: any) => R, arrayToTraverse?: any[]) : R | Function{
  if (!transformFunction) return (transformFunction: (arg:any) => R, arrayToTraverse?: any[] ): R| Function => traverse(destFunctor, transformFunction, arrayToTraverse);
  if (!arrayToTraverse) return ( arrayToTraverse?: any[] ): R | Function => traverse(destFunctor, transformFunction, arrayToTraverse);
  return arrayToTraverse
    .reduce( ( functor, item ) =>
      functor
        .map( traversedArray => transformedItem => traversedArray.concat([transformedItem]))
        .ap(transformFunction(item)),
      destFunctor([])
    );
};

export function traverseObject<R extends {map:Function}>( destFunctor: (arg:any) => R): (transformFunction: (arg:any) => R, objOfFunctors?: object) => R | ((objOfFunctors: object ) => R)
export function traverseObject<R extends {map:Function}>( destFunctor: (arg:any) => R, transformFunction:(arg:any)=> any): ( objOfFunctors: object ) => R
export function traverseObject<R extends {map:Function}>( destFunctor: (arg:any) => R, transformFunction:(arg:any)=> any, objOfFunctors: object): R
export function traverseObject<R extends {map:Function}>( destFunctor: (arg:any) => R, transformFunction?:(arg:any)=> any, objOfFunctors?: object):R | Function {
  if (!transformFunction) return (transformFunction: (arg:any) => R, objOfFunctors?: any[] ): R| Function => traverseObject(destFunctor, transformFunction, objOfFunctors);
  if (!objOfFunctors) return ( objOfFunctors: any[] ): R | Function => traverseObject(destFunctor, transformFunction, objOfFunctors);
  return traverse<R>( destFunctor, transformFunction, Object.values( objOfFunctors ))
    .map((x: any[]) => (keys: string[]) =>
      reduce(( acc, curr, index )=> assoc( keys[index], curr, acc ) , {}, x)
    )
    .ap(destFunctor(Object.keys( objOfFunctors ))) ;
}
