import { assert } from 'chai';
import {inverseAssign, map, propPath, reduce, reduceRight, dissocPath, propPush} from './objects';

describe( 'objects', function() {
  describe( 'propPath', function() {
    const obj = {
      a:{
        b:{
          c:'hello'
        },
        arr:[
          {
            name:'nombre'
          }
        ]
      }
    };
    it( 'calls mGet when all the params are passed', () => {
      const result = propPath([ 'a','b','c' ] );
      assert.equal( result(obj), 'hello' );
    });
    it( 'Accepts curried params', () => {
      const res = propPath([ 'a','b','c' ]);
      assert.isFunction( res );
      const result = res( obj );
      assert.equal( result, 'hello' );
    });
    it( 'Accepts curried params for array', () => {
      const res = propPath([ 'a','arr', '0','name' ]);
      assert.isFunction( res );
      const result = res( obj );
      assert.equal( result, 'nombre' );
    });
    it( 'returns undefined if any part of the path does not exist', () => {
      const result = propPath([ 'a', 'does not exists', 'this one either' ]);
      assert.isFunction( result );
      assert.isUndefined( result( obj ));
    });
  });

  describe('dissocPath', function() {
    it('returns a new object without the deep property', () => {
      const original = {
        nest: {
          string: 'string',
          number: 1
        }
      }
      const res = dissocPath(['nest', 'string'])(original)
      expect(res).toEqual({nest: {number:1}})
    });
    it('returns a new array without the deep property', () => {
      const original = {
        nest: {
          string: 'string',
          number: 1,
          array: [1,2,3]
        }
      }
      const res = dissocPath(['nest', 'array', 1])(original)
      expect(res).toEqual({nest: {number:1, string:'string', array:[1,3]}})
    });
    it('returns the same object if path is empty', () => {
      const original = {
        nest: {
          string: 'string',
          number: 1
        }
      }
      const res = dissocPath([])(original)
      expect(res).toEqual({nest: {number:1, string:'string'}})
    });
    it('returns the same object if object at path is undefined', () => {
      const original = {
        nest: {
          string: 'string',
          number: 1
        }
      }
      const res = dissocPath(['nest', 'does not exists'])(original)
      expect(res).toEqual({nest: {number:1, string:'string'}})
    });
  });

  describe('propPush', function() {
    it('pushes an element into a nested array', () => {
      const original = {arr: [1,2,3]};
      const res = propPush('arr', original)(4);
      expect(res).toEqual({arr: [1,2,3,4]})
    });
    it('pushes an element into a non existent array property in an object', () => {
      const original = {};
      const res = propPush('arr', original)(4);
      expect(res).toEqual({arr: [4]})
    })
  });

  describe('inverseAssign', function() {
    it('assigns the left object to the right one', () => {
      const obj1 = {a:1, b:2, c:3};
      const obj2 = {a:5, b:6, c:3};
      assert.deepEqual(inverseAssign(obj1, obj2), Object.assign({}, obj1, obj2))
      assert.deepEqual(inverseAssign(obj1)(obj2), Object.assign({}, obj1, obj2))
    });
  });

  describe( 'reduce', function() {
    it ('works on arrays', () => {
      assert.deepEqual( reduce(( acc, val ) => {
        acc+=val;
        return acc;
      }, 0, [1,2,3,4,5]), 15);
    })
    it( 'works on Objects', () => {
      interface example {
        result:number;
        keys:string[];
      };
      assert.deepEqual( reduce(( acc, val, key ) => {
        acc.result += val;
        acc.keys.push( key );
        return acc;
      }, { result:0, keys:[]}, {
        a:1,
        b:2,
        c:3,
        d:4
      }), {
        result: 10,
        keys: [ 'a','b','c','d' ]
      });
    });
  });

  describe( 'reduceRight', function() {
    it( 'works on Objects', () => {
      assert.deepEqual( reduceRight(( acc, val, key ) => {
        acc.result += val;
        acc.keys.push( key );
        return acc;
      }, { result:0, keys:[]}, {
        a:1,
        b:2,
        c:3,
        d:4
      }), {
        result: 10,
        keys: [ 'd', 'c', 'b', 'a' ]
      });
    });
    it( 'works on Objects with curry', () => {
      assert.deepEqual( reduceRight(( acc, val, key ) => {
        acc.result += val;
        acc.keys.push( key );
        return acc;
      }, { result:0, keys:[]})({
        a:1,
        b:2,
        c:3,
        d:4
      }), {
        result: 10,
        keys: [ 'd', 'c', 'b', 'a' ]
      });
    });
  });

  describe( 'map', function() {
    it ('works on arrays', () => {
      assert.deepEqual( map(( val, index: number ) => {
        return val + index;
      }, [1,2,3,4,5]), [1,3,5,7,9]);
    })
    it( 'works on Objects', () => {
      assert.deepEqual( map(( val, key: string ) => {
        return `${key}${val}`;
      })({
        a:1,
        b:2,
        c:3,
        d:4
      }), {
        a:'a1',
        b:'b2',
        c:'c3',
        d:'d4'
      });
    });
  });
});
