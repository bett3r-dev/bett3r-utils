import {assert} from 'chai';

import {
  isError
} from './predicates';

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
