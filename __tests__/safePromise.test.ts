import {safePromise} from "../src/safePromise";

describe("@bett3r-dev/crocks", function () {
  describe( 'safePromise', function() {
    const isNil = (value:any) => [null, undefined].includes(value);
    const not = (value:any) => !value;
    const compose = (f:any, g:any) => (x:any) => f(g(x));
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
