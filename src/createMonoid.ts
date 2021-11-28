import { isNil } from '@bett3r-dev/crocks';
import * as _equals from '@bett3r-dev/crocks/core/equals';
import fl from '@bett3r-dev/crocks/core/flNames';
import _implements from '@bett3r-dev/crocks/core/implements';
import _inspect from '@bett3r-dev/crocks/core/inspect';
import isSameType from '@bett3r-dev/crocks/core/isSameType';

export interface Monoid<T>{
  (initial?: T): MonoidInstance<T>;
  '@@implements': (test: string) => boolean;
  empty: () => MonoidInstance<T>;
  type: () => string;
  '@@type': () => string;
}

export interface MonoidInstance<T> {
  valueOf: () => T
  equals: (otherMonoid: MonoidInstance<T>) => boolean
  concat: (otherMonoid: MonoidInstance<T>) => MonoidInstance<T>
  empty: () => MonoidInstance<T>
  inspect: () => string
  [key:string]: any
}

export function createMonoid<T>(name:string, empty: T, concatFn: (a:T, b:T) => T, equalFn: (a:T,b:T) => boolean = _equals): Monoid<T> {
  const _empty = () : MonoidInstance<T> => _monoid(empty);
  const _type = () => name;
  function _monoid(initial?: T): MonoidInstance<T> {
    const value = isNil(initial) ? _empty().valueOf() : initial

    const valueOf = () => value;
    const empty = _empty;
    const inspect = (): string => `${name}${_inspect(valueOf())}`
    const equals = (otherMonoid: MonoidInstance<T>): boolean => isSameType(_monoid, otherMonoid) && equalFn(value, otherMonoid.valueOf());
    const concat = (method: string) => {
      return (otherMonoid: MonoidInstance<T>) => {
        // istanbul ignore next
        if(!isSameType(_monoid, otherMonoid)) {
          throw new TypeError(`${name}.${method}: ${name} required`)
        }
        return _monoid(concatFn(value, otherMonoid.valueOf()))
      }
    }

    return {
      inspect, toString: inspect,
      equals, valueOf, type:_type, empty,
      ['@@type']: _type,
      concat: concat('concat'),
      [fl.equals]: equals,
      [fl.concat]: concat(fl.concat),
      [fl.empty]: empty,
      constructor: _monoid,
      name
    }
  }

  _monoid['@@implements'] = _implements(
    [ 'equals', 'concat', 'empty' ]
  )

  _monoid.empty = _empty;
  _monoid.type = _type;
  //@ts-ignore
  _monoid[fl.empty] = _empty;

  _monoid['@@type'] = _type;

  return _monoid;
}
