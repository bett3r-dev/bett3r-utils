export function propPath( objectPath: string[] ) : ((obj:object) => any);
export function propPath( objectPath: string[], obj: object ): any;
export function propPath( objectPath: string[], obj?: object ): (any | ((obj:object) => any)) {
  if ( !obj ) return (obj: object) => propPath( objectPath, obj );
  return objectPath.reduce(( currentObject, part ) => currentObject && currentObject[part], obj );
}
