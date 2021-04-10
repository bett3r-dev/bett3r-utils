import { assert } from "chai";
import Async from "crocks/Async";
import Either from "crocks/Either";
import * as mod from "./crocks";
import { identity } from "rambda";
import { Functor } from "crocks/internal";

describe("crocks", function () {
  describe("fromPromise", function () {
    it("Converts a resolved promise to a resolved Async instance", (done) => {
      const p = Promise.resolve("hola");
      mod.promiseToAsync(p).fork(done, (str) => {
        assert.equal(str, "hola");
        done();
      });
    });
    it("Converts a rejected promise to a rejected Async instance", (done) => {
      const p = Promise.reject("hola");
      mod.promiseToAsync(p).fork((str) => {
        assert.equal(str, "hola");
        done();
      }, done);
    });
  });

  describe("ensureAsync", function () {
    it("returns the same async if param is async", () => {
      const x = Async.of("2");
      const y = mod.ensureAsync(x);
      assert.equal(x, y);
    });
    it("returns an async if param is whatever type", done => {
      const asyncArray = [];
      const num = 345;
      const str = "345";
      const arr = [345];
      const obj = { n: 345 };
      const und = undefined;
      asyncArray.push(mod.ensureAsync(num));
      asyncArray.push(mod.ensureAsync(str));
      asyncArray.push(mod.ensureAsync(arr));
      asyncArray.push(mod.ensureAsync(obj));
      asyncArray.push(mod.ensureAsync(und));
      mod.traverse(Async.of, identity, asyncArray)
        .fork(done, res => {
          assert.deepEqual(res, [345, '345', [345], {n:345}, undefined])
          done();
        })
    });
    it("returns an async if param is a promise", done => {
      const x = Promise.resolve("2");
      const y = mod.ensureAsync(x);
      y.fork(done, res => {
        assert.equal(res, '2');
        done();
      })
    });
  });
  describe( 'falsyToAsync', function() {
    it( 'returns rejected async of condition', done => {
      assert.isTrue( mod.falsyToAsync([].length ).type() === 'Async');
      mod.falsyToAsync( [].length )
        .fork(() => done(), () => done(Error('Not ok')) );
    });
    it( 'returns async of anything', () => {
      assert.isTrue( mod.falsyToAsync(['hola'].length ).type() === 'Async');
      mod.falsyToAsync(['hola'].length )
        .fork( identity, () => assert( true ));
      Async.of( true )
        .chain( mod.falsyToAsync )
        .fork( () => assert( false ), () => assert( true ));
    });
  });

  describe( 'falsyToEither', function() {
    it( 'returns rejected Either of condition', done => {
      assert.isTrue( mod.falsyToEither([].length ).type() === 'Either');
      mod.falsyToEither( [].length )
        .either(() => done(), () => done(Error('Not ok')) );
    });
    it( 'returns Either of anything', () => {
      assert.isTrue( mod.falsyToEither(['hola'].length ).type() === 'Either');
      mod.falsyToEither(['hola'].length )
        .either( identity, () => assert( true ));
      Either.of( true )
        .chain( mod.falsyToEither )
        .either( () => assert( false ), () => assert( true ));
    });
  });

  describe( 'nullableToAsync', function() {
    it( 'returns rejected async of null', done => {
      assert.isTrue( mod.nullableToAsync( null ).type() === 'Async');
      mod.nullableToAsync( null )
        .fork(() => done(), done );
    });
    it( 'returns rejected async of undefined', done => {
      assert.isTrue( mod.nullableToAsync( undefined ).type() === 'Async');
      mod.nullableToAsync( undefined )
        .fork(() => done(), done );
    });
    it( 'returns async of anything', done => {
      assert.isTrue( mod.nullableToAsync(['hola'].length ).type() === 'Async');
      mod.nullableToAsync(['hola'].length )
        .chain(() => Async.of( true ))
        .chain( mod.nullableToAsync )
        .fork( () => assert(false, 'El valor no es null'), () => done());
    });
  });

  describe( 'nullableToEither', function() {
    it( 'returns rejected async of null', done => {
      assert.isTrue( mod.nullableToEither( null ).type() === 'Either');
      mod.nullableToEither( null )
        .either(() => done(), done );
    });
    it( 'returns rejected async of undefined', done => {
      assert.isTrue( mod.nullableToEither( undefined ).type() === 'Either');
      mod.nullableToEither( undefined )
        .either(() => done(), done );
    });
    it( 'returns async of anything', done => {
      assert.isTrue( mod.nullableToEither(['hola'].length ).type() === 'Either');
      mod.nullableToEither(['hola'].length )
        .chain(() => Either.of( true ))
        .chain( mod.nullableToEither )
        .either( () => assert(false, 'El valor no es null'), () => done());
    });
  });

  describe( 'traverse', function() {
    it( 'traverses one array of X(native values) into a point of X', ( done ) => {
      const someAsync = ( x ) => Async(( reject, resolve ) => {
        setTimeout(() => {
          resolve( x * 2 );
        }, 10 );
      });
      mod.traverse( Async.of, someAsync, [ 1,2,3,4 ])
        .fork(done, ( result: number[] ) => {
          assert.deepEqual(result, [2,4,6,8])
          done();
        });
    });
    it( 'traverses one array of X(semigroup) into a X of an array', ( done ) => {
      const someAsync = ( x ) => Async(( reject, resolve ) => {
        setTimeout(() => {
          resolve( x * 2 );
        }, 100 );
      });
      mod.traverse( Async.of, x=> x, [ someAsync( 1 ),someAsync( 2 ),someAsync( 3 ),someAsync( 4 ) ])
        .fork(done, ( result ) => {
          assert.deepEqual(result, [2,4,6,8])
          done();
        });
    });
    it( 'traverses one array of X(semigroup) into a X of an array transformed by fn', ( done ) => {
      const someAsync = asyncInstance =>
        asyncInstance.chain(x=>Async(( reject, resolve ) => {
          setTimeout(() => {
            resolve( x * 2 );
          }, 100 );
        }));
      mod.traverse( Async.of, someAsync, [ Async.of( 1 ), Async.of( 2 ), Async.of( 3 ), Async.of( 4 ) ])
        .fork(done, ( result ) => {
          assert.deepEqual(result, [2,4,6,8])
          done();
        });
    });
  });
});
