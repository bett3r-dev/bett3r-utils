import { compose, isNil, not } from 'ramda';
import {safePromise} from "../src/safePromise";

describe("@bett3r-dev/crocks", function () {
  describe( 'safePromise', function() {
    it( 'returns rejected promise of null', done => {
      safePromise(isNil, null )
        .then( done , () => done());
    });
    it( 'returns rejected promise of undefined', done => {
      safePromise(isNil, undefined )
        .then(done, () => done());
    });
    it( 'returns promise of anything', done => {
      safePromise(compose(not, isNil), ['hola', 'pana'].length )
        .then((l) => expect(l).toEqual(2), done)
        .then(() => done())
    });
  });
});
