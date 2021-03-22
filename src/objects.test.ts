import { assert } from 'chai';
import {propPath} from './objects';

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
});
