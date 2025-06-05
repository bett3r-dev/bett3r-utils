import { deepDiff } from '../src';

describe('deepDiff', function() {
  describe('identical objects', () => {
    it('returns empty object for identical simple objects', () => {
      expect(deepDiff({a: 1, b: 2, c: 3, d: 4}, {a: 1, b: 2, c: 3, d: 4})).toEqual({});
    });

    it('returns empty object for identical complex objects', () => {
      const obj = {
        id: 1,
        name: 'test',
        meta: { size: 42, tags: ['x', 'y'] },
        active: true,
        nested: { deep: { value: 'test' } }
      };
      expect(deepDiff(obj, obj)).toEqual({});
    });

    it('returns empty object for empty objects', () => {
      expect(deepDiff({}, {})).toEqual({});
    });
  });

  describe('primitive value changes', () => {
    it('detects string changes', () => {
      expect(deepDiff({name: 'Alpha'}, {name: 'Beta'})).toEqual({
        name: 'Alpha'
      });
    });

    it('detects number changes', () => {
      expect(deepDiff({count: 5}, {count: 10})).toEqual({
        count: 5
      });
    });

    it('detects boolean changes', () => {
      expect(deepDiff({active: true}, {active: false})).toEqual({
        active: true
      });
    });

    it('detects null value changes', () => {
      expect(deepDiff({value: null}, {value: 'something'})).toEqual({
        value: null
      });
    });

    it('detects undefined value changes', () => {
      expect(deepDiff({value: undefined}, {value: 'something'})).toEqual({
        value: undefined
      });
    });
  });

  describe('type changes', () => {
    it('detects string to number changes', () => {
      expect(deepDiff({value: '42'}, {value: 42})).toEqual({
        value: '42'
      });
    });

    it('detects object to array changes', () => {
      expect(deepDiff({data: {a: 1}}, {data: [1, 2, 3]})).toEqual({
        data: {a: 1}
      });
    });

    it('detects array to object changes', () => {
      expect(deepDiff({data: [1, 2, 3]}, {data: {a: 1}})).toEqual({
        data: [1, 2, 3]
      });
    });

    it('detects primitive to object changes', () => {
      expect(deepDiff({value: 'text'}, {value: {nested: true}})).toEqual({
        value: 'text'
      });
    });

    it('detects object to primitive changes', () => {
      expect(deepDiff({value: {nested: true}}, {value: 'text'})).toEqual({
        value: {nested: true}
      });
    });
  });

  describe('array differences', () => {
    it('detects new items in arrays', () => {
      expect(deepDiff({tags: ['x', 'y']}, {tags: ['x']})).toEqual({
        tags: ['y']
      });
    });

    it('returns empty when no new items in array', () => {
      expect(deepDiff({tags: ['x']}, {tags: ['x', 'y']})).toEqual({});
    });

    it('ignores array order - no diff when same elements', () => {
      expect(deepDiff({tags: ['x', 'y']}, {tags: ['y', 'x']})).toEqual({});
    });

    it('detects all items when comparing to empty array', () => {
      expect(deepDiff({tags: ['x', 'y']}, {tags: []})).toEqual({
        tags: ['x', 'y']
      });
    });

    it('returns empty when comparing empty to non-empty arrays', () => {
      expect(deepDiff({tags: []}, {tags: ['x']})).toEqual({});
    });

    it('detects new nested objects in arrays', () => {
      expect(deepDiff(
        {items: [{id: 1}, {id: 2}, {id: 3}]}, 
        {items: [{id: 1}, {id: 2}]}
      )).toEqual({
        items: [{id: 3}]
      });
    });

    it('detects complex new items in arrays', () => {
      expect(deepDiff(
        {matrix: [[1, 2], [3, 4], [5, 6]]}, 
        {matrix: [[1, 2], [3, 4]]}
      )).toEqual({
        matrix: [[5, 6]]
      });
    });
  });

  describe('property addition and removal', () => {
    it('detects added properties', () => {
      expect(deepDiff({a: 1, b: 2}, {a: 1})).toEqual({
        b: 2
      });
    });

    it('detects removed properties', () => {
      expect(deepDiff({a: 1}, {a: 1, b: 2})).toEqual({
        b: undefined
      });
    });

    it('detects multiple added properties', () => {
      expect(deepDiff({a: 1, b: 2, c: 3}, {a: 1})).toEqual({
        b: 2,
        c: 3
      });
    });

    it('detects multiple removed properties', () => {
      expect(deepDiff({a: 1}, {a: 1, b: 2, c: 3})).toEqual({
        b: undefined,
        c: undefined
      });
    });
  });

  describe('nested object differences', () => {
    it('detects nested property changes', () => {
      expect(deepDiff(
        {user: {name: 'Alice', age: 30}}, 
        {user: {name: 'Bob', age: 30}}
      )).toEqual({
        user: {name: 'Alice'}
      });
    });

    it('detects nested property additions', () => {
      expect(deepDiff(
        {user: {name: 'Alice', age: 30}}, 
        {user: {name: 'Alice'}}
      )).toEqual({
        user: {age: 30}
      });
    });

    it('detects nested property removals', () => {
      expect(deepDiff(
        {user: {name: 'Alice'}}, 
        {user: {name: 'Alice', age: 30}}
      )).toEqual({
        user: {age: undefined}
      });
    });

    it('handles deeply nested changes', () => {
      expect(deepDiff(
        {a: {b: {c: {d: 1}}}}, 
        {a: {b: {c: {d: 2}}}}
      )).toEqual({
        a: {b: {c: {d: 1}}}
      });
    });

    it('handles empty nested objects', () => {
      expect(deepDiff(
        {nested: {}}, 
        {nested: {value: 1}}
      )).toEqual({
        nested: {value: undefined}
      });
    });
  });

  describe('complex mixed scenarios', () => {
    it('handles the original complex example with new array behavior', () => {
      const A = {
        id: 1,
        name: 'Alpha',
        meta: { size: 42, tags: ['x', 'z'] },
        extra: true,
      };
      
      const B = {
        id: 1,
        name: 'Beta',
        meta: { size: 42, tags: ['x', 'y'] },
        removed: 'obsolete',
      };

      expect(deepDiff(A, B)).toEqual({
        name: 'Alpha',
        meta: { tags: ['z'] },
        extra: true,
        removed: undefined
      });
    });

    it('handles mixed type and structure changes with arrays', () => {
      const A = {
        data: {
          items: ['a', 'b', 'c'],
          count: 2,
          metadata: {
            created: '2023-01-01',
            active: true
          }
        },
        config: 'simple'
      };

      const B = {
        data: {
          items: ['a', 'b'],
          count: 3,
          metadata: {
            created: '2023-01-01',
            modified: '2023-01-02'
          }
        },
        config: { complex: true },
        newField: 'added'
      };

      expect(deepDiff(A, B)).toEqual({
        data: {
          items: ['c'],
          count: 2,
          metadata: {
            active: true,
            modified: undefined
          }
        },
        config: 'simple',
        newField: undefined
      });
    });
  });

  describe('edge cases', () => {
    it('handles objects with null prototype', () => {
      const objA = Object.create(null);
      objA.a = 1;
      const objB = Object.create(null);
      objB.a = 2;
      
      expect(deepDiff(objA, objB)).toEqual({a: 1});
    });

    it('handles objects with inherited properties', () => {
      const parent = {inherited: 'value'};
      const childA = Object.create(parent);
      childA.own = 'A';
      const childB = Object.create(parent);
      childB.own = 'B';
      
      expect(deepDiff(childA, childB)).toEqual({own: 'A'});
    });

    it('handles very deep nesting', () => {
      const createDeepObject = (depth: number, value: any): any => {
        if (depth === 0) return value;
        return { nested: createDeepObject(depth - 1, value) };
      };

      const deepA = createDeepObject(10, 'A');
      const deepB = createDeepObject(10, 'B');
      const expected = createDeepObject(10, 'A');

      expect(deepDiff(deepA, deepB)).toEqual(expected);
    });

    it('handles arrays with complex objects', () => {
      const objA = { 
        users: [
          { id: 1, name: 'Alice' }, 
          { id: 2, name: 'Bob' },
          { id: 3, name: 'Charlie' }
        ] 
      };
      const objB = { 
        users: [
          { id: 1, name: 'Alice' }, 
          { id: 2, name: 'Bob' }
        ] 
      };
      
      expect(deepDiff(objA, objB)).toEqual({
        users: [{ id: 3, name: 'Charlie' }]
      });
    });
  });
});