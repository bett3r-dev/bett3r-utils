import { deepMerge } from '../src';

describe('deepMerge', function() {
  describe('basic merging behavior', () => {
    it('merges simple objects', () => {
      const a = { x: 1, y: 2 };
      const b = { y: 3, z: 4 };
      expect(deepMerge(a, b)).toEqual({ x: 1, y: 3, z: 4 });
    });

    it('returns a copy when merging with empty object', () => {
      const a = { x: 1, y: 2 };
      const result = deepMerge(a, {});
      expect(result).toEqual(a);
      expect(result).not.toBe(a); // Should be a new object
    });

    it('merges empty object with non-empty object', () => {
      const b = { x: 1, y: 2 };
      expect(deepMerge({}, b)).toEqual(b);
    });

    it('handles merging empty objects', () => {
      expect(deepMerge({}, {})).toEqual({});
    });

    it('preserves properties from first object when not in second', () => {
      const a = { x: 1, y: 2, z: 3 };
      const b = { y: 20 };
      expect(deepMerge(a, b)).toEqual({ x: 1, y: 20, z: 3 });
    });
  });

  describe('primitive value merging', () => {
    it('second object string overwrites first', () => {
      expect(deepMerge({ name: 'Alpha' }, { name: 'Beta' })).toEqual({
        name: 'Beta'
      });
    });

    it('second object number overwrites first', () => {
      expect(deepMerge({ count: 5 }, { count: 10 })).toEqual({
        count: 10
      });
    });

    it('second object boolean overwrites first', () => {
      expect(deepMerge({ active: true }, { active: false })).toEqual({
        active: false
      });
    });

    it('handles null values from second object', () => {
      expect(deepMerge({ value: 'something' }, { value: null })).toEqual({
        value: null
      });
    });

    it('handles undefined values from second object', () => {
      expect(deepMerge({ value: 'something' }, { value: undefined })).toEqual({
        value: undefined
      });
    });

    it('overwrites null in first with value from second', () => {
      expect(deepMerge({ value: null }, { value: 'something' })).toEqual({
        value: 'something'
      });
    });

    it('overwrites undefined in first with value from second', () => {
      expect(deepMerge({ value: undefined }, { value: 'something' })).toEqual({
        value: 'something'
      });
    });
  });

  describe('type conversion scenarios', () => {
    it('overwrites string with number', () => {
      expect(deepMerge({ value: '42' }, { value: 42 })).toEqual({
        value: 42
      });
    });

    it('overwrites object with array', () => {
      expect(deepMerge({ data: { a: 1 } }, { data: [1, 2, 3] })).toEqual({
        data: [1, 2, 3]
      });
    });

    it('overwrites array with object', () => {
      expect(deepMerge({ data: [1, 2, 3] }, { data: { a: 1 } })).toEqual({
        data: { a: 1 }
      });
    });

    it('overwrites primitive with object', () => {
      expect(deepMerge({ value: 'text' }, { value: { nested: true } })).toEqual({
        value: { nested: true }
      });
    });

    it('overwrites object with primitive', () => {
      expect(deepMerge({ value: { nested: true } }, { value: 'text' })).toEqual({
        value: 'text'
      });
    });

    it('overwrites primitive with array', () => {
      expect(deepMerge({ value: 'text' }, { value: [1, 2, 3] })).toEqual({
        value: [1, 2, 3]
      });
    });

    it('overwrites array with primitive', () => {
      expect(deepMerge({ value: [1, 2, 3] }, { value: 'text' })).toEqual({
        value: 'text'
      });
    });
  });

  describe('array concatenation', () => {
    it('concatenates arrays (first array elements come first)', () => {
      expect(deepMerge({ tags: ['x'] }, { tags: ['y', 'z'] })).toEqual({
        tags: ['x', 'y', 'z']
      });
    });
    
    it('concatenates arrays, skips duplicates', () => {
      expect(deepMerge({ tags: ['x', 'y'] }, { tags: ['y', 'z'] })).toEqual({
        tags: ['x', 'y', 'z']
      });
    });

    it('concatenates arrays with different lengths', () => {
      expect(deepMerge({ tags: ['a', 'b', 'c'] }, { tags: ['x'] })).toEqual({
        tags: ['a', 'b', 'c', 'x']
      });
    });

    it('concatenates with empty array in first position', () => {
      expect(deepMerge({ tags: [] }, { tags: ['x', 'y'] })).toEqual({
        tags: ['x', 'y']
      });
    });

    it('concatenates with empty array in second position', () => {
      expect(deepMerge({ tags: ['x', 'y'] }, { tags: [] })).toEqual({
        tags: ['x', 'y']
      });
    });

    it('concatenates two empty arrays', () => {
      expect(deepMerge({ tags: [] }, { tags: [] })).toEqual({
        tags: []
      });
    });

    it('concatenates arrays with mixed types', () => {
      expect(deepMerge({ data: [1, 'a'] }, { data: [true, null] })).toEqual({
        data: [1, 'a', true, null]
      });
    });

    it('concatenates nested arrays as elements', () => {
      expect(deepMerge(
        { matrix: [[1, 2], [3, 4]] }, 
        { matrix: [[5, 6]] }
      )).toEqual({
        matrix: [[1, 2], [3, 4], [5, 6]]
      });
    });

    it('concatenates arrays with object elements', () => {
      expect(deepMerge(
        { items: [{ id: 1, name: 'a' }] },
        { items: [{ id: 2, name: 'b' }, { id: 3, name: 'c' }] }
      )).toEqual({
        items: [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' }]
      });
    });
  });

  describe('nested object merging', () => {
    it('merges nested objects recursively', () => {
      const a = { user: { name: 'Alice', age: 30 } };
      const b = { user: { name: 'Bob', city: 'NYC' } };
      expect(deepMerge(a, b)).toEqual({
        user: { name: 'Bob', age: 30, city: 'NYC' }
      });
    });

    it('merges deeply nested objects', () => {
      const a = { a: { b: { c: { d: 1, e: 2 } } } };
      const b = { a: { b: { c: { d: 10, f: 3 } } } };
      expect(deepMerge(a, b)).toEqual({
        a: { b: { c: { d: 10, e: 2, f: 3 } } }
      });
    });

    it('adds new nested properties', () => {
      const a = { config: { theme: 'dark' } };
      const b = { config: { language: 'en', features: { beta: true } } };
      expect(deepMerge(a, b)).toEqual({
        config: { theme: 'dark', language: 'en', features: { beta: true } }
      });
    });

    it('handles merging with empty nested objects', () => {
      const a = { nested: { value: 1 } };
      const b = { nested: {} };
      expect(deepMerge(a, b)).toEqual({
        nested: { value: 1 }
      });
    });

    it('merges empty nested object with non-empty', () => {
      const a = { nested: {} };
      const b = { nested: { value: 1 } };
      expect(deepMerge(a, b)).toEqual({
        nested: { value: 1 }
      });
    });

    it('overwrites nested null with object', () => {
      const a = { config: null };
      const b = { config: { theme: 'light' } };
      expect(deepMerge(a, b)).toEqual({
        config: { theme: 'light' }
      });
    });

    it('overwrites nested object with null', () => {
      const a = { config: { theme: 'light' } };
      const b = { config: null };
      expect(deepMerge(a, b)).toEqual({
        config: null
      });
    });

    it('concatenates arrays within nested objects', () => {
      const a = { 
        user: { 
          name: 'Alice', 
          hobbies: ['reading', 'swimming'] 
        } 
      };
      const b = { 
        user: { 
          age: 30, 
          hobbies: ['coding', 'gaming'] 
        } 
      };
      expect(deepMerge(a, b)).toEqual({
        user: { 
          name: 'Alice', 
          age: 30, 
          hobbies: ['reading', 'swimming', 'coding', 'gaming'] 
        }
      });
    });
  });

  describe('complex mixed scenarios', () => {
    it('handles complex real-world merging scenario', () => {
      const defaults = {
        server: {
          port: 3000,
          host: 'localhost',
          ssl: false
        },
        database: {
          host: 'localhost',
          port: 5432,
          ssl: true
        },
        features: ['auth', 'logging']
      };

      const userConfig = {
        server: {
          port: 8080,
          ssl: true
        },
        database: {
          host: 'prod-db.example.com'
        },
        features: ['monitoring', 'analytics'],
        newFeature: true
      };

      expect(deepMerge(defaults, userConfig)).toEqual({
        server: {
          port: 8080,
          host: 'localhost',
          ssl: true
        },
        database: {
          host: 'prod-db.example.com',
          port: 5432,
          ssl: true
        },
        features: ['auth', 'logging', 'monitoring', 'analytics'],
        newFeature: true
      });
    });

    it('handles mixed types in complex structure', () => {
      const a = {
        data: {
          items: ['a', 'b'],
          count: 2,
          metadata: {
            created: '2023-01-01',
            active: true
          }
        },
        config: 'simple',
        tags: ['old']
      };

      const b = {
        data: {
          items: ['x', 'y', 'z'],
          total: 100,
          metadata: {
            active: false,
            modified: '2023-01-02'
          }
        },
        config: { complex: true },
        tags: ['new', 'updated']
      };

      expect(deepMerge(a, b)).toEqual({
        data: {
          items: ['a', 'b', 'x', 'y', 'z'],
          count: 2,
          total: 100,
          metadata: {
            created: '2023-01-01',
            active: false,
            modified: '2023-01-02'
          }
        },
        config: { complex: true },
        tags: ['old', 'new', 'updated']
      });
    });

    it('handles arrays and objects at multiple nesting levels', () => {
      const a = {
        level1: {
          level2: {
            arrays: ['a1', 'a2'],
            objects: { prop1: 'value1' }
          },
          directArray: ['x']
        }
      };

      const b = {
        level1: {
          level2: {
            arrays: ['b1'],
            objects: { prop2: 'value2' }
          },
          directArray: ['y', 'z']
        }
      };

      expect(deepMerge(a, b)).toEqual({
        level1: {
          level2: {
            arrays: ['a1', 'a2', 'b1'],
            objects: { prop1: 'value1', prop2: 'value2' }
          },
          directArray: ['x', 'y', 'z']
        }
      });
    });
  });

  describe('immutability', () => {
    it('returns a new object (does not mutate inputs)', () => {
      const a = { x: 1, nested: { y: 2 }, arr: ['a'] };
      const b = { x: 10, nested: { z: 3 }, arr: ['b'] };
      const result = deepMerge(a, b);
      
      expect(result).not.toBe(a);
      expect(result).not.toBe(b);
      expect(result.nested).not.toBe(a.nested);
      expect(result.nested).not.toBe(b.nested);
      expect(result.arr).not.toBe(a.arr);
      expect(result.arr).not.toBe(b.arr);
    });

    it('original objects remain unchanged', () => {
      const a = { x: 1, nested: { y: 2 }, arr: ['a'] };
      const b = { x: 10, nested: { z: 3 }, arr: ['b'] };
      const aCopy = { ...a, nested: { ...a.nested }, arr: [...a.arr] };
      const bCopy = { ...b, nested: { ...b.nested }, arr: [...b.arr] };
      
      deepMerge(a, b);
      
      expect(a).toEqual(aCopy);
      expect(b).toEqual(bCopy);
    });
  });

  describe('edge cases', () => {
    it('handles objects with null prototype', () => {
      const objA = Object.create(null);
      objA.a = 1;
      objA.arr = ['x'];
      const objB = Object.create(null);
      objB.b = 2;
      objB.arr = ['y'];
      
      expect(deepMerge(objA, objB)).toEqual({ a: 1, b: 2, arr: ['x', 'y'] });
    });

    it('handles objects with inherited properties', () => {
      const parent = { inherited: 'value' };
      const childA = Object.create(parent);
      childA.ownA = 'A';
      childA.arr = ['a'];
      const childB = Object.create(parent);
      childB.ownB = 'B';
      childB.arr = ['b'];
      
      expect(deepMerge(childA, childB)).toEqual({ ownA: 'A', ownB: 'B', arr: ['a', 'b'] });
    });

    it('handles very deep nesting with arrays', () => {
      const createDeepObject = (depth: number, value: any): any => {
        if (depth === 0) return { final: value, arr: [value] };
        return { nested: createDeepObject(depth - 1, value) };
      };

      const deepA = createDeepObject(5, 'A');
      const deepB = createDeepObject(5, 'B');
      
      const result = deepMerge(deepA, deepB);
      
      // Navigate to the deepest level to check the merge
      let current = result;
      for (let i = 0; i < 5; i++) {
        current = current.nested;
      }
      expect(current.final).toBe('B'); // B should overwrite A
      expect(current.arr).toEqual(['A', 'B']); // Arrays should be concatenated
    });

    it('handles mixed deep and shallow properties with arrays', () => {
      const a = {
        shallow: 'a',
        shallowArr: ['a1'],
        deep: { 
          level1: { 
            level2: { 
              valueA: 'A',
              deepArr: ['deep1']
            } 
          } 
        }
      };
      const b = {
        shallow: 'b',
        shallowArr: ['b1', 'b2'],
        deep: { 
          level1: { 
            level2: { 
              valueB: 'B',
              deepArr: ['deep2']
            } 
          } 
        }
      };

      expect(deepMerge(a, b)).toEqual({
        shallow: 'b',
        shallowArr: ['a1', 'b1', 'b2'],
        deep: { 
          level1: { 
            level2: { 
              valueA: 'A', 
              valueB: 'B',
              deepArr: ['deep1', 'deep2']
            } 
          } 
        }
      });
    });

    it('handles null and undefined in arrays', () => {
      expect(deepMerge(
        { arr: [null, 'a', undefined] },
        { arr: [1, null] }
      )).toEqual({
        arr: [null, 'a', undefined, 1]
      });
    });

    it('concatenates arrays with duplicate elements', () => {
      expect(deepMerge(
        { tags: ['common', 'a', 'common'] },
        { tags: ['b', 'common', 'c'] }
      )).toEqual({
        tags: ['common', 'a', 'b', 'c']
      });
    });
  });
}); 