// export interface DictionaryObject<T> {[index: string]: T}
export type ArrayIterator<T, U> = (x: T, index:any, collection:T[]) => U;
export type RecordIterator<T, U> = (x: T, prop: string, inputObj: Record<string|number|symbol, T>) => U;
import {curry} from 'ramda'
import { Unpack } from './common';

/**
 * Takes a function and a functor, applies the function to each of the functor's values, and returns a functor of the same shape.
 * It works for both Arrays and Objects.
 * 
 * @example
 * ```typescript
 * const double = x => x * 2;
 *
 * map(double, [1, 2, 3]); //=> [2, 4, 6]
 *
 * map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
 * ```
 * 
 * @param fn Map function to apply
 * @param iterable collection to iterate
 */
export function map<Output, Iterable extends Array<Input> | Record<string|number|symbol, Input>, Input = Unpack<Iterable>>(mapFunction: Iterable extends Array<Input> ? ArrayIterator<Input, Output> : RecordIterator<Input, Output>): (collection: Iterable) => Iterable extends Array<Input> ? Array<Output> : Record<string|number|symbol, Output>
export function map<Output, Iterable extends Array<Input> | Record<string|number|symbol, Input>, Input = Unpack<Iterable>>(mapFunction: Iterable extends Array<Input> ? ArrayIterator<Input, Output> : RecordIterator<Input, Output>, collection: Iterable): Iterable extends Array<Input> ? Array<Output> : Record<string|number|symbol, Output>
export function map<Output, Iterable extends Array<Input> | Record<string|number|symbol, Input>, Input = Unpack<Iterable>>(mapFunction: Iterable extends Array<Input> ? ArrayIterator<Input, Output> : RecordIterator<Input, Output>, collection?: Iterable) {
  if ( arguments.length === 1 ) return (collection) => map( mapFunction, collection );
  if ( !collection ) return collection;
  if ( Array.isArray( collection )) return collection.map(mapFunction as ArrayIterator<Input, Output>);
  const result = {};
  Object.keys( collection )
    .forEach(( key: string ) => result[key] = (mapFunction as RecordIterator<Input, Output>)(collection[key], key, collection ) );
  return result;
}
