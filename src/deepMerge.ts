import { JsonObject } from "./types";

/**
 * deepMerge
 * Deep merges two objects, with properties from `b` taking precedence over `a`.
 * - Nested objects are merged recursively
 * - Arrays are concatenated (elements from `a` first, then elements from `b`)
 * - null and undefined values from `b` will override values in `a`
 * - Returns a new object (immutable operation)
 */
export function deepMerge<A extends JsonObject, B extends JsonObject>(
  a: A,
  b: B
): A & B {
  const result: JsonObject = { ...a };
  
  for (const key of Object.keys(b)) {
    const valueA = result[key];
    const valueB = b[key];
    
    // If b's value is null or undefined, use it directly
    if (valueB === null || valueB === undefined) {
      result[key] = valueB;
      continue;
    }
    
    // If a doesn't have this key, use b's value
    if (!(key in result)) {
      result[key] = valueB;
      continue;
    }
    
    // If a's value is null or undefined, use b's value
    if (valueA === null || valueA === undefined) {
      result[key] = valueB;
      continue;
    }
    
    // If both are arrays, concatenate them and remove duplicates
    if (Array.isArray(valueA) && Array.isArray(valueB)) {
      const combined = [...valueA, ...valueB];
      result[key] = combined.filter((item, index) => combined.indexOf(item) === index);
      continue;
    }
    
    // If both are plain objects (not arrays), merge recursively
    if (
      typeof valueA === 'object' &&
      typeof valueB === 'object' &&
      !Array.isArray(valueA) &&
      !Array.isArray(valueB)
    ) {
      result[key] = deepMerge(
        valueA as JsonObject,
        valueB as JsonObject
      );
    } else {
      // For all other cases (primitives, type mismatches), b overwrites a
      result[key] = valueB;
    }
  }
  
  return result as A & B;
} 