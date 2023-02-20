/**
 * Ensures the parameter is an array, in case is not, the function will return an array containing the parameter.
 * @arrays
 * 
 * @param theArray The variable to ensure is an array
 * @returns 
 */
export const ensureArray = <T>( theArray?: T | T[] ): T[] => Array.isArray( theArray ) ? theArray : ( theArray != null ? [theArray] : []);