import { map } from '../src';

describe( 'map', function() {
  it ('works on arrays', () => {
    expect( map(( val, index: number ) => {
      return val + index;
    }, [1,2,3,4,5])).toEqual([1,3,5,7,9]);
  })
  it( 'works on Objects', () => {
    expect( map(( val, key ) => {
      return `${key}${val}`;
    })({
      a:1,
      b:2,
      c:3,
      d:4
    })).toEqual({
      a:'a1',
      b:'b2',
      c:'c3',
      d:'d4'
    });
  });
});