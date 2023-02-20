import { Unpack } from "./common";

export function reduceRight<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE ) : ((init: RTYPE, collection?: VTYPE ) => RTYPE) | (((collection: VTYPE ) => RTYPE))
export function reduceRight<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE, init?: RTYPE ): ((collection: VTYPE ) => RTYPE)
export function reduceRight<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE, init?: RTYPE, collection?: VTYPE ) : RTYPE
export function reduceRight<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: any) => RTYPE, init?: RTYPE, collection?: VTYPE ) {
  if ( !collection ) return (collection: VTYPE) => reduceRight( reducer, init, collection );
  if ( Array.isArray( collection )) return collection.reduceRight(reducer, init );
  return Object.keys( collection )
    .reduceRight(( acc, key ) =>
      reducer( acc, (collection as {[key:string]: any})[key], key )
    , init as RTYPE );
};