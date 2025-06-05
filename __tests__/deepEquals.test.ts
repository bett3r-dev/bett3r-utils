import { deepEquals } from '../src';

describe('deepEquals', function() {
  describe('primitive values', () => {
    it('returns true for identical primitives', () => {
      expect(deepEquals(1, 1)).toBe(true);
      expect(deepEquals('hello', 'hello')).toBe(true);
      expect(deepEquals(true, true)).toBe(true);
      expect(deepEquals(false, false)).toBe(true);
      expect(deepEquals(null, null)).toBe(true);
      expect(deepEquals(undefined, undefined)).toBe(true);
    });

    it('returns false for different primitives', () => {
      expect(deepEquals(1, 2)).toBe(false);
      expect(deepEquals('hello', 'world')).toBe(false);
      expect(deepEquals(true, false)).toBe(false);
      expect(deepEquals(null, undefined)).toBe(false);
      expect(deepEquals(0, false)).toBe(false);
      expect(deepEquals('', false)).toBe(false);
      expect(deepEquals(1, '1')).toBe(false);
    });
  });

  describe('arrays', () => {
    it('returns true for identical empty arrays', () => {
      expect(deepEquals([], [])).toBe(true);
    });

    it('returns true for arrays with same primitive elements', () => {
      expect(deepEquals([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(deepEquals(['a', 'b'], ['a', 'b'])).toBe(true);
      expect(deepEquals([true, false, null], [true, false, null])).toBe(true);
    });

    it('returns false for arrays with different lengths', () => {
      expect(deepEquals([1, 2], [1, 2, 3])).toBe(false);
      expect(deepEquals([1, 2, 3], [1, 2])).toBe(false);
      expect(deepEquals([], [1])).toBe(false);
    });

    it('returns false for arrays with different elements', () => {
      expect(deepEquals([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(deepEquals(['a', 'b'], ['a', 'c'])).toBe(false);
      expect(deepEquals([true, false], [false, true])).toBe(false);
    });

    it('works with nested arrays', () => {
      expect(deepEquals([[1, 2], [3, 4]], [[1, 2], [3, 4]])).toBe(true);
      expect(deepEquals([[1, 2], [3, 4]], [[1, 2], [3, 5]])).toBe(false);
      expect(deepEquals([[[1]]], [[[1]]])).toBe(true);
      expect(deepEquals([[[1]]], [[[2]]])).toBe(false);
    });

    it('works with arrays containing objects', () => {
      expect(deepEquals([{a: 1}, {b: 2}], [{a: 1}, {b: 2}])).toBe(true);
      expect(deepEquals([{a: 1}, {b: 2}], [{a: 1}, {b: 3}])).toBe(false);
    });
  });

  describe('objects', () => {
    it('returns true for identical empty objects', () => {
      expect(deepEquals({}, {})).toBe(true);
    });

    it('returns true for objects with same properties', () => {
      expect(deepEquals({a: 1, b: 2}, {a: 1, b: 2})).toBe(true);
      expect(deepEquals({a: 1, b: 2}, {b: 2, a: 1})).toBe(true); // different order
    });

    it('returns false for objects with different property counts', () => {
      expect(deepEquals({a: 1}, {a: 1, b: 2})).toBe(false);
      expect(deepEquals({a: 1, b: 2}, {a: 1})).toBe(false);
    });

    it('returns false for objects with different property values', () => {
      expect(deepEquals({a: 1, b: 2}, {a: 1, b: 3})).toBe(false);
      expect(deepEquals({a: 1}, {a: 2})).toBe(false);
    });

    it('returns false for objects with different property keys', () => {
      expect(deepEquals({a: 1}, {b: 1})).toBe(false);
      expect(deepEquals({a: 1, b: 2}, {a: 1, c: 2})).toBe(false);
    });

    it('works with nested objects', () => {
      expect(deepEquals({a: {b: 1}}, {a: {b: 1}})).toBe(true);
      expect(deepEquals({a: {b: 1}}, {a: {b: 2}})).toBe(false);
      expect(deepEquals({a: {b: {c: 1}}}, {a: {b: {c: 1}}})).toBe(true);
      expect(deepEquals({a: {b: {c: 1}}}, {a: {b: {c: 2}}})).toBe(false);
    });

    it('works with objects containing arrays', () => {
      expect(deepEquals({a: [1, 2]}, {a: [1, 2]})).toBe(true);
      expect(deepEquals({a: [1, 2]}, {a: [1, 3]})).toBe(false);
      expect(deepEquals({a: [1, 2], b: [3, 4]}, {a: [1, 2], b: [3, 4]})).toBe(true);
    });

    it('works with complex nested structures', () => {
      const obj1 = {
        a: 1,
        b: [1, 2, {c: 3, d: [4, 5]}],
        e: {f: {g: 'hello'}}
      };
      const obj2 = {
        a: 1,
        b: [1, 2, {c: 3, d: [4, 5]}],
        e: {f: {g: 'hello'}}
      };
      const obj3 = {
        a: 1,
        b: [1, 2, {c: 3, d: [4, 6]}], // different value
        e: {f: {g: 'hello'}}
      };
      
      expect(deepEquals(obj1, obj2)).toBe(true);
      expect(deepEquals(obj1, obj3)).toBe(false);
    });
  });

  describe('type mismatches', () => {
    it('returns false when comparing different types', () => {
      expect(deepEquals([], {})).toBe(false);
      expect(deepEquals({}, [])).toBe(false);
      expect(deepEquals(1, [1])).toBe(false);
      expect(deepEquals('hello', {0: 'h', 1: 'e', 2: 'l', 3: 'l', 4: 'o'})).toBe(false);
      expect(deepEquals(null, {})).toBe(false);
      expect(deepEquals(undefined, {})).toBe(false);
      expect(deepEquals(null, [])).toBe(false);
      expect(deepEquals(undefined, [])).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles same object reference', () => {
      const obj = {a: 1, b: [2, 3]};
      expect(deepEquals(obj, obj)).toBe(true);
      
      const arr = [1, 2, {a: 3}];
      expect(deepEquals(arr, arr)).toBe(true);
    });

    it('handles objects with null values', () => {
      expect(deepEquals({a: null}, {a: null})).toBe(true);
      expect(deepEquals({a: null}, {a: undefined})).toBe(false);
      expect(deepEquals({a: null}, {})).toBe(false);
    });

    it('handles arrays with null/undefined values', () => {
      expect(deepEquals([null, undefined], [null, undefined])).toBe(true);
      expect(deepEquals([null], [undefined])).toBe(false);
    });

    it('handles objects with undefined values', () => {
      expect(deepEquals({a: undefined}, {a: undefined})).toBe(true);
      expect(deepEquals({a: undefined}, {})).toBe(false);
    });
  });
});