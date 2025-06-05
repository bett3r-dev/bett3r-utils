import { JsonObject } from "./types";
import { deepEquals } from "./deepEquals";

/**
 * deepDiff
 * Returns the slice of `a` that differs from `b`.
 *  – Added/changed keys carry `a`'s value.
 *  – Keys that exist in `b` but not in `a` are surfaced with `undefined`.
 *  – For arrays, only items that are new in `a` (not present in `b`) are included.
 */
export function deepDiff<A extends JsonObject, B extends JsonObject>(
  a: A,
  b: B
): Partial<A & B> {
  const result: JsonObject = {};
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

  for (const k of keys) {
    const hasA = Object.prototype.hasOwnProperty.call(a, k);
    const hasB = Object.prototype.hasOwnProperty.call(b, k);

    if (hasA && hasB) {
      const valA = a[k];
      const valB = b[k];

      // identical → skip
      if (deepEquals(valA, valB)) continue;

      // both arrays → compare elements and extract new ones
      if (Array.isArray(valA) && Array.isArray(valB)) {
        const newItems = valA.filter(itemA => 
          !valB.some(itemB => deepEquals(itemA, itemB))
        );
        if (newItems.length > 0) {
          result[k] = newItems;
        }
        continue;
      }

      // both plain objects → recurse
      if (
        valA !== null &&
        valB !== null &&
        typeof valA === 'object' &&
        typeof valB === 'object' &&
        !Array.isArray(valA) &&
        !Array.isArray(valB)
      ) {
        const nested = deepDiff(
          valA as JsonObject,
          valB as JsonObject
        );
        if (Object.keys(nested).length) result[k] = nested;
        continue;
      }

      // value changed
      result[k] = valA;
    } else if (hasA && !hasB) {
      // Added in A
      result[k] = a[k];
    } else if (!hasA && hasB) {
      // Removed from A
      result[k] = undefined;
    }
  }

  return result as Partial<A & B>;
}
