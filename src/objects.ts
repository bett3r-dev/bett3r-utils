export function propPath( objectPath: string[] ) : ((obj:object) => any);
export function propPath( objectPath: string[], obj: object ): any;
export function propPath( objectPath: string[], obj?: object ): (any | ((obj:object) => any)) {
  if ( !obj ) return (obj: object) => propPath( objectPath, obj );
  return objectPath.reduce(( currentObject:{[key:string]:any}, part ) => currentObject && currentObject[part], obj );
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
// export function map<VTYPE, RTYPE = any>(mapFunction: (element: Unpack<VTYPE>, index: any, collection?: VTYPE) => RTYPE, collection: VTYPE) {
//   if ( !collection ) return (collection: VTYPE) => map( mapFunction, collection );
//   if ( Array.isArray( collection )) return collection.map(mapFunction as unknown as (element: Unpack<VTYPE>, index: number, collection: Unpack<VTYPE>[]) => RTYPE);
//   const result: Record<string, RTYPE> = {};
//   Object.keys( collection )
//     .forEach(( key: string ) => result[key] = mapFunction( (collection as {[key:string]: any})[key], key, collection ) );
//   return result;
// }

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
