import { reduce } from '../src';

describe( 'reduce', function() {
  it ('works on arrays', () => {
    expect( reduce(( acc, val ) => {
      acc+=val;
      return acc;
    }, 0, [1,2,3,4,5])).toEqual(15);
  })
  it( 'works on Objects', () => {
    interface example {
      result:number;
      keys:string[];
    };
    expect( reduce(( acc, val, key: string ) => {
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
      keys: [ 'a','b','c','d' ]
    });
  });
});
