import {noop} from './functions'

describe('noop', function() {
  it('returns undefined', () => {
    expect(noop()).toBeUndefined();
  });
});