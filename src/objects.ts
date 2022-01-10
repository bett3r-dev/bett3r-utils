import { isArray, isInteger } from "@bett3r-dev/crocks";
import {push, remove} from './arrays'
import {dissoc, assoc, update, prop, propOr} from 'rambda'

export function propPath( objectPath: string[] ) : ((obj:object) => any);
export function propPath( objectPath: string[], obj: object ): any;
export function propPath( objectPath: string[], obj?: object ): (any | ((obj:object) => any)) {
  if ( arguments.length !== 2 ) return (obj: object) => propPath( objectPath, obj );
  return objectPath.reduce(( currentObject:{[key:string]:any}, part ) => currentObject && currentObject[part], obj );
}

export function assocPath<T>( objectPath: string[], nValue: any): (obj:T) => T  
export function assocPath<T>( objectPath: string[], nValue: any, obj: T ) : T
export function assocPath<T>( objectPath: string[], nValue: any, obj?: T ): ((obj:T) => T  ) | T {
  if ( arguments.length !== 3 ) return (obj: T) => assocPath( objectPath, nValue, obj );
  if (!objectPath.length && typeof nValue === 'object') return nValue;
  const path = objectPath.slice( 0 );
  const lastPath = path.pop();
  const lastPart = path.reduce(( currentObject, part ) => {
    currentObject[part] = currentObject[part] || {};
    return currentObject[part];
  }, obj );
  lastPart[lastPath] = nValue;
  return obj;
}

export function dissocPath( objectPath: (string|number)[] ) : ((obj:object) => any);
export function dissocPath( objectPath: (string|number)[], obj: object ): any
export function dissocPath( objectPath: (string|number)[], obj?: object ): any {
  if ( arguments.length !== 2 ) return (obj: object) => dissocPath( objectPath, obj );
  switch (objectPath.length) {
    case 0:
      return obj;
    case 1:
      return isInteger(objectPath[0]) && isArray(obj) ? remove(objectPath[0], 1, obj) : dissoc(objectPath[0] as string, obj);
    default:
      var head = objectPath[0];
      var tail = Array.prototype.slice.call(objectPath, 1);
      if (!obj[head]) {
        return obj;
      } else if (isInteger(head) && isArray(obj)) {
        return update(head, dissocPath(tail, obj[head] as object), obj);
      } else {
        return assoc(head as string, dissocPath(tail, obj[head]), obj);
      }
  }
}

export function propPush (property:string, obj: Record<string, any[]>): (value:any) => Record<string, any[]>
export function propPush (property:string, obj: Record<string, any[]>, value:any): Record<string, any[]>
export function propPush (property:string, obj: Record<string, any[]>, value?:any): Record<string, any[]> |((value:any) => Record<string, any[]>) {
  if ( arguments.length !== 3 ) return (value:any) => propPush(property, obj, value);
  return assoc(property, push(value, propOr([], property, obj)), obj)
} 

export function inverseAssign<A extends object, B extends object>(originalObj: A) : ((patchObj: B) => A & B);
export function inverseAssign<A extends object, B extends object>(originalObj: A, patchObj: B) : A & B;
export function inverseAssign<A extends object, B extends object>(originalObj: A, patchObj?: B): A & B | ((obj: B) => A & B) {
  if (!patchObj) return (patchObj: B) => inverseAssign(originalObj, patchObj);
  return Object.assign({}, originalObj, patchObj);
}

export interface DictionaryObject<T> {[index: string]: T}
export type ArrayIterator<T, U> = (x: T, index:any, collection:T[]) => U;
export type RecordIterator<T, U> = (x: T, prop: string, inputObj: DictionaryObject<T>) => U;
export function map<T, U>(fn: RecordIterator<T, U>, iterable: DictionaryObject<T>): DictionaryObject<U>;
export function map<T, U>(fn: ArrayIterator<T, U>, iterable: T[]): U[];
export function map<T, U>(fn: ArrayIterator<T, U>): (iterable: T[]) => U[];
export function map<T, U>(fn: RecordIterator<T, U>): (iterable: DictionaryObject<T>) => DictionaryObject<U>;
export function map<T>(fn: ArrayIterator<T, T>): (iterable: T[]) => T[];
export function map<T>(fn: ArrayIterator<T, T>, iterable: T[]): T[];
export function map(mapFunction, collection?) {
  if ( !collection ) return (collection) => map( mapFunction, collection );
  if ( Array.isArray( collection )) return collection.map(mapFunction);
  const result = {};
  Object.keys( collection )
    .forEach(( key: string ) => result[key] = mapFunction(collection[key], key, collection ) );
  return result;
}

type Unpack<A> = A extends Array<infer E> ? E : A extends Record<string, infer E> ? E : any;

export function reduce<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE ) : RTYPE | ((init: RTYPE, collection?: VTYPE ) => RTYPE | ((collection: VTYPE ) => RTYPE))
export function reduce<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE, init?: RTYPE ): RTYPE | ((collection: VTYPE ) => RTYPE)
export function reduce<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE, init?: RTYPE, collection?: VTYPE ) : RTYPE
export function reduce<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE, init?: RTYPE, collection?: VTYPE ): RTYPE | Function {
  if ( !collection ) return (collection: VTYPE) => reduce( reducer, init, collection );
  if ( Array.isArray( collection )) return collection.reduce(reducer, init );
  return Object.keys( collection )
    .reduce(( acc, key ) =>
      reducer( acc, (collection as {[key:string]: any})[key], key )
    , init as RTYPE );
};
export function reduceRight<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE ) : RTYPE | ((init: RTYPE, collection?: VTYPE ) => RTYPE | ((collection: VTYPE ) => RTYPE))
export function reduceRight<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE, init?: RTYPE ): RTYPE | ((collection: VTYPE ) => RTYPE)
export function reduceRight<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE, init?: RTYPE, collection?: VTYPE ) : RTYPE
export function reduceRight<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE, init?: RTYPE, collection?: VTYPE ): RTYPE | Function {
  if ( !collection ) return (collection: VTYPE) => reduceRight( reducer, init, collection );
  if ( Array.isArray( collection )) return collection.reduceRight(reducer, init );
  return Object.keys( collection )
    .reduceRight(( acc, key ) =>
      reducer( acc, (collection as {[key:string]: any})[key], key )
    , init as RTYPE );
};
