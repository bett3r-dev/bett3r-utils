import { reduce } from 'rambda';

export const ensureArray = <T>( theArray?: T | T[] ): T[] => Array.isArray( theArray ) ? theArray : ( theArray != null ? [theArray] : []);

export function foldMap <T>( fn: <T>(element: any) => T ): (collection: any[]) => T[];
export function foldMap <T>( fn: <T>(element: any) => T, collection: any[]):  T[];
export function foldMap <T>( fn: <T>(element: any) => T, collection?: any[]): T[]|Function {
  if (!collection) return (collection: any[]) => foldMap(fn, collection)
  return reduce(( acc, functor ) => acc.concat( functor.map ? functor.map( fn ) : fn( functor )), [], collection );
}

export function push<T>( value: any ): (list: Array<T>) => Array<T>;
export function push<T>( value: any, list: Array<T> ): Array<T>;
export function push<T>( value: any, list?: Array<T> ): Array<T>|Function {
  if ( !list ) return (l: Array<T>) => push( value, l );
  list.push( value );
  return list;
}

export function unshift<T>( value: any ): (list: Array<T>) => Array<T>;
export function unshift<T>( value: any, list: Array<T> ): Array<T>;
export function unshift <T>( value: any, list?: Array<T> ): Array<T>|Function {
  if ( !list ) return (l: Array<T>) => unshift( value, l );
  list.unshift( value );
  return list;
}

export function findAndPerform <T,V>( predicate: (element: any) => any ): (iterable: Iterable<T>) => V;
export function findAndPerform <T,V>( predicate: (element: any) => any, iterable: Iterable<T> ): V;
export function findAndPerform <T,V>( predicate: (element: any) => any, iterable?: Iterable<T> ): V|Function|undefined {
  if ( !iterable ) return (iterable: Iterable<T>) => findAndPerform( predicate, iterable );
  for ( const item of iterable ) {
    const result = predicate( item );
    if ( !result ) continue;
    return result;
  }
};

export function remove<T>(index: number, length: number) : (array?: T[]) => T[]
export function remove<T>(index: number, length:number, array: T[]): T[]
export function remove<T>(index: number, length: number, array?: T[]): T[] | ((array?: T[]) => T[]) {
  if (!array) return (array: T[]) => remove(index, length, array); 
  const copy = array.slice(0);
  copy.splice(index, length);
  return copy;
}

export default {
  ensureArray,
  foldMap,
  push,
  unshift,
  findAndPerform
}
