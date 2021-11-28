import { assert } from 'chai';
import {
  ensureArray, findAndPerform, foldMap,
  push,
  unshift,
  remove
} from './arrays';


describe('arrays', function() {
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
    it( 'CURRIED folds and map an array of arrays', () => {
      const arr = [[ 1,2,3 ], [2], [ 2,3 ]];
      assert.deepEqual( foldMap( x=>x )( arr ), [ 1,2,3,2,2,3 ]);
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
    it( 'CURRIED finds an item in an array appliying a predicate, and returns the result of such apply over found item', () => {
      const arr = [ 2, 4 ];
      const result = findAndPerform( x => x % 2)( arr );
      assert.isUndefined( result );
    });
    it( 'finds an item in an array appliying a predicate, and returns the result of such apply over found item', () => {
      const arr = [ 2, 4, 3 ];
      const result = findAndPerform( x => x % 2, arr );
      assert.equal( result, 1 );
    });
  });

  describe('remove', function() {
    it('returns a copy of the array without 1 element', () => {
      const original = [1,2,3];
      const res = remove(1,1, original);
      expect(original !== res).toBeTruthy();
      expect(res).toEqual([1,3])
    });
    it('returns a copy of the array without 3 element', () => {
      const original = [1,2,3,4,5];
      const res = remove(1,3);
      expect(original !== res(original)).toBeTruthy();
      expect(res(original)).toEqual([1,5])
    });
  });
});
