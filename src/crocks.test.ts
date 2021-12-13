import {Async, Either, Identity, isDefined, isNil} from "@bett3r-dev/crocks";
import {stream} from '@bett3r-dev/flyd' 
import { assert } from "chai";
import { identity } from "rambda";
import { jsonParse } from ".";
import * as mod from "./crocks";

describe("@bett3r-dev/crocks", function () {
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
        .fork(done, (res: any[]) => {
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

  describe( 'safeAsync', function() {
    it( 'returns rejected async of null', done => {
      assert.isTrue( mod.safeAsync(isNil,  null ).type() === 'Async');
      mod.safeAsync(isNil, null )
        .fork(() => done(), done );
    });
    it( 'returns rejected async of undefined', done => {
      assert.isTrue( mod.safeAsync(isNil, undefined ).type() === 'Async');
      mod.safeAsync(isNil, undefined )
        .fork(() => done(), done );
    });
    it( 'returns async of anything', done => {
      assert.isTrue( mod.safeAsync(isNil, ['hola'].length ).type() === 'Async');
      mod.safeAsync(isDefined, ['hola'].length )
        .chain(() => Async.of( true ))
        .chain( mod.safeAsync(isDefined))
        .bimap(x=> { console.log('111', x); return x; }, x=> { console.log('222', x); return x; },) 
        .fork( () => assert(false, 'El valor no es null'), () => done());
    });
  });

  describe( 'safeResult', function() {
    it( 'returns rejected result of null', done => {
      assert.isTrue( mod.safeResult(isNil, null ).type() === 'Result');
      mod.safeResult(isNil, null )
        .either(() => done(), done );
    });
    it( 'returns rejected result of undefined', done => {
      assert.isTrue( mod.safeResult(isNil, undefined ).type() === 'Result');
      mod.safeResult(isNil, undefined )
        .either(() => done(), done );
    });
    it( 'returns Result of anything', done => {
      assert.isTrue( mod.safeResult(isDefined, stream()).type() === 'Result');
      mod.safeResult(isDefined, stream() )
        .either( () => assert(false, 'El valor no es null'), () => done());
    });
  });

  describe( 'safeEither', function() {
    it( 'returns rejected either of null', done => {
      assert.isTrue( mod.safeEither(isNil, null ).type() === 'Either');
      mod.safeEither(isNil, null )
        .either(() => done(), done );
    });
    it( 'returns rejected either of undefined', done => {
      assert.isTrue( mod.safeEither(isNil, undefined ).type() === 'Either');
      mod.safeEither(isNil, undefined )
        .either(() => done(), done );
    });
    it( 'returns Either of anything', done => {
      assert.isTrue( mod.safeEither(isDefined, stream()).type() === 'Either');
      mod.safeEither(isDefined, stream() )
        .either( () => assert(false, 'El valor no es null'), () => done());
    });
  });

  describe( 'traverse', function() {
    it( 'traverses one array of X(native values) into a point of X', ( done ) => {
      const someAsync = ( x:number ) => Async(( reject, resolve ) => {
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
      const someAsync = ( x:number ) => Async(( reject, resolve ) => {
        setTimeout(() => {
          resolve( x * 2 );
        }, 100 );
      });
      mod.traverse( Async.of, x=> x, [ someAsync( 1 ),someAsync( 2 ),someAsync( 3 ),someAsync( 4 ) ])
        .fork(done, ( result: number[] ) => {
          assert.deepEqual(result, [2,4,6,8])
          done();
        });
    });
    it( 'traverses one array of X(semigroup) into a X of an array transformed by fn', ( done ) => {
      const someAsync = (asyncInstance:Async<number>) =>
        asyncInstance.chain((x:number)=>Async(( reject, resolve ) => {
          setTimeout(() => {
            resolve( x * 2 );
          }, 100 );
        }));
      mod.traverse( Async.of, someAsync, [ Async.of( 1 ), Async.of( 2 ), Async.of( 3 ), Async.of( 4 ) ])
        .fork(done, ( result:number[] ) => {
          assert.deepEqual(result, [2,4,6,8])
          done();
        });
    });
  });

  describe( 'traverseObject', function() {
    it( 'traverses the values of an object of Identity', () => {
      const obj = { a: Identity.of( 34 ), b:Identity.of( 35 ), c:Identity.of( 36 ) };
      const res = mod.traverseObject( Identity.of, identity, obj );
      assert.equal( res.type(), 'Identity' );
      assert.deepEqual( res.valueOf(), { a:34, b:35, c:36 });
    });
    it( 'traverses the values of an object of Async', done => {
      const obj = { a: Async.of( 34 ), b:Async.of( 35 ), c:Async.of( 36 ) };
      const res = mod.traverseObject( Async.of, identity, obj );
      assert.equal( res.type(), 'Async' );
      res
        .map( result=> {
          assert.deepEqual( result, { a:34, b:35, c:36 });
          return result;
        })
        .fork( done, ()=> done());
    });
  })
  describe('jsonParse', () => {
    it('returns a result ok if json is valid', done =>{
      jsonParse(`{"name":"tomas"}`)
        .either(done, () => done());
    });
  });
});
