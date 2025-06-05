import { JsonObject, JsonValue } from "./types";

/** Lightweight deep equality check (sufficient for JSON-like trees) */
export function deepEquals(a: JsonValue, b: JsonValue): boolean {
  if (a === b) return true;

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEquals(v, b[i]));
  }

  // Handle plain objects
  if (
    a !== null &&
    b !== null &&
    typeof a === 'object' &&
    typeof b === 'object' &&
    !Array.isArray(a) &&
    !Array.isArray(b)
  ) {
    const keysA = Object.keys(a as JsonObject);
    const keysB = Object.keys(b as JsonObject);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(k => 
      k in (b as JsonObject) && deepEquals(
        (a as JsonObject)[k],
        (b as JsonObject)[k]
      )
    );
  }

  return false; // mismatched primitives / array vs object / etc.
}