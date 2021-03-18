import {assert} from 'chai';
import Async from 'crocks/Async';

import {
  isError,
  ensureArray,
  foldMap,
  push,
  unshift,
  findAndPerform,
  traverse
} from './index';

describe('utils', function() {
  describe( 'isError', function() {
    it( 'returns true if the param passed is instance of errro', () => {
      class X extends Error {}
      const Y = new Error();
      assert.isTrue( isError( new Error()));
      assert.isTrue( isError( new X()));
      assert.isTrue( isError( Y ));
    });
    it( 'returns false if the param passed is instance of errro', () => {
      assert.isFalse( isError());
      assert.isFalse( isError( 1 ));
      assert.isFalse( isError( '' ));
      assert.isFalse( isError( true ));
      assert.isFalse( isError( null ));
      assert.isFalse( isError({}));
      assert.isFalse( isError([]));
    });
  });

  describe( 'ensureArray', function() {
    it( 'returns an array with the value passed as param if is not array', () => {
      assert.deepEqual([], ensureArray());
      assert.deepEqual([3],ensureArray( 3 ));
      assert.deepEqual([10n],ensureArray( 10n ));
      assert.deepEqual([],ensureArray( undefined ));
      assert.deepEqual([],ensureArray( null ));
      assert.deepEqual([false],ensureArray( false ));
      assert.deepEqual([{}],ensureArray({}));
      assert.deepEqual(['1'],ensureArray( '1' ));
      assert.deepEqual(['asdf'],ensureArray( 'asdf' ));
    });
    it( 'returns the same value if array passed', () => {
      assert.deepEqual([3],ensureArray([3]));
      assert.deepEqual([10n],ensureArray([10n]));
      assert.deepEqual([undefined],ensureArray([undefined]));
      assert.deepEqual([null],ensureArray([null]));
      assert.deepEqual([{}],ensureArray([{}]));
      assert.deepEqual(['1'],ensureArray(['1']));
      assert.deepEqual(['asdf'],ensureArray(['asdf']));
    });
  });

  describe( 'push', function() {
    it( 'pushes the value into an array and return the array', () =>
      assert.deepEqual( push( 3, [ 1,2 ]) , [ 1,2,3 ]));
    it( 'Curried pushes the value into an array and return the array', () => {
      const fn = push( 3 );
      assert.deepEqual( fn([ 1,2 ]) , [ 1,2,3 ]);
    });
  });

  describe( 'foldMap', function() {
    it( 'folds and map an array of arrays', () => {
      const arr = [[ 1,2,3 ], [2], [ 2,3 ]];
      assert.deepEqual( foldMap( x=>x, arr ), [ 1,2,3,2,2,3 ]);
    });
  });

  describe( 'unshift', function() {
    it( 'unshifts the value into an array and return the array', () =>
      assert.deepEqual( unshift( 1, [ 2,3 ]) , [ 1,2,3 ]));
    it( 'Curried unshifts the value into an array and return the array', () => {
      const fn = unshift( 1 );
      assert.deepEqual( fn([ 2,3 ]) , [ 1,2,3 ]);
    });
  });

  describe( 'findAndPerform', function() {
    it( 'finds an item in an array appliying a predicate, and returns the result of such apply over found item', () => {
      const arr = [ 2, 4 ];
      const result = findAndPerform( x => x % 2, arr );
      assert.isUndefined( result );
    });
    it( 'finds an item in an array appliying a predicate, and returns the result of such apply over found item', () => {
      const arr = [ 2, 4, 3 ];
      const result = findAndPerform( x => x % 2, arr );
      assert.equal( result, 1 );
    });
  });

  describe( 'traverse', function() {
    it( 'traverses one array of X(concatenable) into a X of an array', ( done ) => {
      const someAsync = ( x ) => Async(( reject, resolve ) => {
        setTimeout(() => {
          resolve( x * 2 );
        }, 10 );
      });
      traverse( Async.of, someAsync, [ 1,2,3,4 ])
        .fork(done, ( result ) => {
          assert.deepEqual(result, [2,4,6,8])
          done();
        });
    });
    it( 'traverses one array of X(concatenable) into a X of an array', ( done ) => {
      const someAsync = ( x ) => Async(( reject, resolve ) => {
        setTimeout(() => {
          resolve( x * 2 );
        }, 100 );
      });
      traverse( Async.of, x=> x, [ someAsync( 1 ),someAsync( 2 ),someAsync( 3 ),someAsync( 4 ) ])
        .fork(done, ( result ) => {
          assert.deepEqual(result, [2,4,6,8])
          done();
        });
    });
  });
});
