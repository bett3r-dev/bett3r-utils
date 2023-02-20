import { Unpack } from "./common";

/**
 * Returns a single item by iterating through the list,
 * successively calling the iterator function and passing it an accumulator value and the current value from the array,
 * and then passing the result to the next call.
 * Works for both Arrays and Objects
 *
 * The iterator function receives two values: `(acc, value, key)`. In the case of an array `key` is the index, in the case of object is the property name
 * @param reducer Iterator function
 * @param Init Initial Value
 * @param Init Array or object to reduce
 */
export function reduce<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE ) : ((init: RTYPE, collection?: VTYPE ) => RTYPE) | ((collection: VTYPE ) => RTYPE)
export function reduce<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE, init?: RTYPE ): ((collection: VTYPE ) => RTYPE)
export function reduce<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE, init?: RTYPE, collection?: VTYPE ) : RTYPE
export function reduce<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE, init?: RTYPE, collection?: VTYPE ) {
  if ( !collection ) return (collection: VTYPE) => reduce( reducer, init, collection );
  if ( Array.isArray( collection )) return collection.reduce(reducer, init );
  return Object.keys( collection )
    .reduce(( acc, key ) =>
      reducer( acc, (collection as {[key:string]: any})[key], key )
    , init as RTYPE );
};