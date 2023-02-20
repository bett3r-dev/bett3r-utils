import { ensureArray } from '../src/ensureArray';

describe('arrays', function() {
  describe( 'ensureArray', function() {
    it( 'returns an array with the value passed as param if is not array', () => {
      expect([]).toEqual( ensureArray());
      expect([3]).toEqual(ensureArray( 3 ));
      expect([10n]).toEqual(ensureArray( 10n ));
      expect([]).toEqual(ensureArray( undefined ));
      expect([]).toEqual(ensureArray( null ));
      expect([false]).toEqual(ensureArray( false ));
      expect([{}]).toEqual(ensureArray({}));
      expect(['1']).toEqual(ensureArray( '1' ));
      expect(['asdf']).toEqual(ensureArray( 'asdf' ));
    });
    it( 'returns the same value if array passed', () => {
      expect([3]).toEqual(ensureArray([3]));
      expect([10n]).toEqual(ensureArray([10n]));
      expect([undefined]).toEqual(ensureArray([undefined]));
      expect([null]).toEqual(ensureArray([null]));
      expect([{}]).toEqual(ensureArray([{}]));
      expect(['1']).toEqual(ensureArray(['1']));
      expect(['asdf']).toEqual(ensureArray(['asdf']));
    });
  });
});
