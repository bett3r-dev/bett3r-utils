export function propPath( objectPath: string[] ) : ((obj:object) => any);
export function propPath( objectPath: string[], obj: object ): any;
export function propPath( objectPath: string[], obj?: object ): (any | ((obj:object) => any)) {
  if ( !obj ) return (obj: object) => propPath( objectPath, obj );
  return objectPath.reduce(( currentObject, part ) => currentObject && currentObject[part], obj );
}

type Unpack<A> = A extends Array<infer E> ? E : any

export function reduce<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: string|number) => RTYPE, init: RTYPE, collection: VTYPE ) {
  if ( !collection ) return (collection: VTYPE) => reduce( reducer, init, collection );
  if ( Array.isArray( collection )) return collection.reduce(reducer, init );
  return Object.keys( collection ).reduce(( acc, key ) => reducer( acc, collection[key], key ), init );
};
export function reduceRight<VTYPE, RTYPE = any> ( reducer: (acc: RTYPE, curr: Unpack<VTYPE>, key?: string|number) => RTYPE, init: RTYPE, collection: VTYPE ) {
  if ( !collection ) return (collection: VTYPE) => reduceRight( reducer, init, collection );
  if ( Array.isArray( collection )) return collection.reduceRight(reducer, init );
  return Object.keys( collection ).reduceRight(( acc, key ) => reducer( acc, collection[key], key ), init );
};
