import { pushSorted } from '../src/pushSorted';

describe('Push Sorted', () => {
  it( 'pushes in an element sorted in an array of numbers', () => {
    const array = [1, 3, 5, 7, 9];
    const value = 4;
    expect(pushSorted(array, value)).toEqual([1, 3, 4, 5, 7, 9]);
  });
  it('pushes in an element sorted in an array of objects containing a number', () => {
    const array = [{ value: 1 }, { value: 3 }, { value: 5 }, { value: 7 }, { value: 9 }];
    const value = { value: 4 };
    expect(pushSorted(array, value, 'value')).toEqual([{ value: 1 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 7 }, { value: 9 }]);
  });
});
