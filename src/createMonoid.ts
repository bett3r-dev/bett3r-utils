import { isNil } from "rambda";

export type Monoid<T> = {
  (initial?: T): MonoidInstance<T>;
  empty: () => MonoidInstance<T>;
  type: () => string;
  '@@type': () => string;
}

export type MonoidInstance<T> = {
  valueOf: () => T
  equals: (otherMonoid: MonoidInstance<T>) => boolean
  concat: (otherMonoid: MonoidInstance<T>) => MonoidInstance<T>
  empty: () => MonoidInstance<T>
  inspect: () => string
  [key:string]: any
}

export function createMonoid<T>(name:string, empty: T | null | undefined, concatFn: (a:T, b:T) => T, equalFn: (a:T,b:T) => boolean = (a, b) => a === b): Monoid<T> {
  const _empty = () : MonoidInstance<T> => _monoid(empty);
  const _type = () => name;
  function _monoid(initial?: T | null | undefined): MonoidInstance<T> {
    const value = isNil(initial) ? _empty().valueOf() : initial

    const valueOf = () => value;
    const empty = _empty;
    const inspect = (): string => `${name} ${valueOf()}`
    const equals = (otherMonoid: MonoidInstance<T>): boolean => equalFn(value, otherMonoid.valueOf());
    const concat = (method: string) => {
      return (otherMonoid: MonoidInstance<T>) => {
        return _monoid(concatFn(value, otherMonoid.valueOf()))
      }
    }

    return {
      inspect, toString: inspect,
      equals, valueOf, type:_type, empty,
      ['@@type']: _type,
      concat: concat('concat'),
      ['fantasy-land/equals']: equals,
      ['fantasy-land/concat']: concat('fantasy-land/concat'),
      ['fantasy-land/empty']: empty,
      constructor: _monoid,
      name
    }
  }

  _monoid.empty = _empty;
  _monoid.type = _type;

  _monoid['@@type'] = _type;

  return _monoid;
}
