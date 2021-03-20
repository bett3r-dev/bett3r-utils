import fs from 'fs';
import Async from 'crocks/Async';
import maybeToAsync from 'crocks/Async/maybeToAsync';
import safe from 'crocks/Maybe/safe';
import { isNil, isTruthy } from 'crocks';
import { compose, identity, not } from 'rambda';

export const promiseToAsync = (promise: Promise<any>) => Async(( reject, resolve ) => promise.then( resolve, reject ));

export const ensureAsync = ( possibleAsync?: any ) =>
  possibleAsync?.type && possibleAsync.type() === 'Async' ? possibleAsync :
    (( !possibleAsync || !possibleAsync.then ) ? Async.of(possibleAsync) : promiseToAsync( possibleAsync ));

export const nullableToAsync = (arg?: any): Async =>
  Async.of(safe(compose(not, isNil), arg))
    .chain(maybeToAsync(null))

export const falsyToAsync = (arg?: any) : Async =>
  Async.of(safe(isTruthy, arg))
    .chain(maybeToAsync(false))

export const readFile = Async.fromNode(fs.readFile as any);

export interface Functor<ADT>{
  map: (fn: (arg: any)=> any) => ADT
}

export function traverse<ADT>( functor:(arg: any)=> Functor<ADT> ): (fn: (arg:any) => any, array?: any[]) => ((array: any[]) => ADT) | ADT
export function traverse<ADT>( functor:(arg: any)=> Functor<ADT>, fn: (arg:any) => any ) :(array: any[]) => ADT
export function traverse<ADT>( functor:(arg: any)=> Functor<ADT>, fn: (arg:any) => any, array: any[] ): ADT
export function traverse<ADT>( functor:(arg: any)=> Functor<ADT>, fn?: (arg:any) => any, array?: any[] ): ADT {
  return array.reduce(( acc, item ) =>
    acc.map( x => y => x.concat([y])).ap( fn( item )), functor([]));
};
