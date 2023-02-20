import { reduceRight } from '../src';

  describe( 'reduceRight', function() {
  it( 'works on Objects', () => {
    expect( reduceRight(( acc, val, key ) => {
      acc.result += val;
      acc.keys.push( key );
      return acc;
    }, { result:0, keys:[]} as {result:number, keys: string[]}, {
      a:1,
      b:2,
      c:3,
      d:4
    })).toEqual({
      result: 10,
      keys: [ 'd', 'c', 'b', 'a' ]
    });
  });

  it( 'works on Objects with curry', () => {
    expect( reduceRight(( acc, val, key ) => {
      acc.result += val;
      acc.keys.push( key );
      return acc;
    }, { result:0, keys:[]} as {result:number, keys: string[]})({
      a:1,
      b:2,
      c:3,
      d:4
    })).toEqual({
      result: 10,
      keys: [ 'd', 'c', 'b', 'a' ]
    });
  });
});
