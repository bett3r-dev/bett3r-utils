import { assert } from 'chai';
import * as mod from './createMonoid';

describe( 'createMonoid', function() {
  let StringArrayConcat: mod.Monoid<string[]>
  beforeEach(() => {
    StringArrayConcat = mod.createMonoid<string[]>('StringArrayConcat', [], (a: string[], b:string[]) => a.concat(b));
  });

  it('creates a monoid with the specific name', () => {
    assert(StringArrayConcat.name, 'StringArrayConcat');
  });

  describe('valueOf', function() {
    it('returns the contained value of the monoid', () => {
      const name1 = StringArrayConcat(['name1'])
      const name2 = StringArrayConcat(['name2'])
      assert.deepEqual(name1.valueOf(), ['name1']);
      assert.deepEqual(name2.valueOf(), ['name2']);
    });
  });

  describe('empty', function() {
    it('returns the initial value', () => {
      const name1 = StringArrayConcat()
      assert.deepEqual(name1.valueOf(), []);
    });
  });

  describe('inspect', function() {
    it('returns a string with the name of the monoid and the value', () => {
      const name1 = StringArrayConcat(['name1'])
      assert.equal(name1.inspect(), 'StringArrayConcat name1')
    });
  });

  describe('equals', function() {
    it('returns false if contained values different', () => {
      const name1 = StringArrayConcat(['name1'])
      const name2 = StringArrayConcat(['name2'])
      assert.isFalse(name1.equals(name2))
    });
  });
  describe('custom equals function', function() {
    let monoid: mod.Monoid<string>
    beforeEach(() => {
      monoid = mod.createMonoid<string>('StringArrayConcat', '', (a, b) => a.concat(b), (a, b) => a.toUpperCase() === b);
    })
    it('returns true if contained values are the same according to equals function', () => {
      const name1 = monoid('name1')
      const name2 = monoid('NAME1')
      assert.isTrue(name1.equals(name2))
    });
    it('returns false if contained values different according to equals function', () => {
      const name1 = monoid('name1')
      const name2 = monoid('name1')
      assert.isFalse(name1.equals(name2))
    });
  });

  describe('concat', function() {

    it('concats with empty values', () => {
      const name1 = StringArrayConcat(['name1'])
      const name2 = StringArrayConcat(['name2'])
      const name3 = StringArrayConcat([])
      assert.deepEqual(name1.concat(name2).concat(name3).valueOf(), ['name1', 'name2']);
    });
  });

});
describe('First monoid', () => {
  const First: mod.Monoid<number> = mod.createMonoid<number>('First', undefined, (a) => a)
  const f1 = First(1);
  const f2 = First(2);
  const f3 = First(3);
  const f4 = First(4);
  const f5 = First(5);
  const f6 = First(6);
  const result = f1
    .concat(f2)
    .concat(f3)
    .concat(f4)
    .concat(f5)
    .concat(f6)
    .valueOf()
  assert.equal(result, 1);
});
