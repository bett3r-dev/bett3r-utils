import { JsonObject } from "./types";
import { deepEquals } from "./deepEquals";

/**
 * deepDiff
 * Compare two objects and return the slice of `patch` that differs from `current`.
 * In other words, it returns the minimal object/array that would need to be merged
 * into `current` to arrive at `patch`.
 *
 *  – Added/changed keys carry `patch`'s value.
 *  – Keys that exist in `current` but not in `patch` are ignored.
 *  – For arrays, only items that are new in `patch` (not present in `current`) are included.
 *
 * NOTE: Prior to v4 this function expected `(patch, current)`. The parameter
 *        order has been swapped to be more intuitive.
 */
export function deepDiff<Current extends JsonObject, Patch extends JsonObject>(
  current: Current,
  patch: Patch
): Partial<Current & Patch> {
  return _deepDiff(patch, current) as Partial<Current & Patch>;
}

/**
 * Internal implementation that expects `(a, b)` where `a` is the *new* state and
 * `b` is the *old* state. This is the original algorithm kept for reuse.
 */
function _deepDiff<A extends JsonObject, B extends JsonObject>(
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
        const nested = _deepDiff(
          valA as JsonObject,
          valB as JsonObject
        );
        // Filter out undefined values from nested result
        const filteredNested = Object.fromEntries(
          Object.entries(nested).filter(([_, value]) => value !== undefined)
        );
        if (Object.keys(filteredNested).length) result[k] = filteredNested;
        continue;
      }

      // value changed - only include if not undefined
      if (valA !== undefined) {
        result[k] = valA;
      }
    } else if (hasA && !hasB) {
      // Added in A - only include if not undefined
      if (a[k] !== undefined) {
        result[k] = a[k];
      }
    } else if (!hasA && hasB) {
      // Removed from A
      // result[k] = null;
    }
  }

  return result as Partial<A & B>;
}
