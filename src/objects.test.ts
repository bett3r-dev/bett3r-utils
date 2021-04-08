import { assert } from 'chai';
import {inverseAssign, propPath, reduce, reduceRight} from './objects';

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
      const result = propPath([ 'a','b','c' ], obj );
      assert.equal( result, 'hello' );
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

  describe('inverseAssign', function() {
    it('assigns the left object to the right one', () => {
      const obj1 = {a:1, b:2, c:3};
      const obj2 = {a:5, b:6, c:3};
      assert.deepEqual(inverseAssign(obj2, {...obj1}), Object.assign({}, obj1, obj2))
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
  });
});
