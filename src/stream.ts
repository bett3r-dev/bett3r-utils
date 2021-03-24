import * as flyd from '@tomasruizr/flyd';
import filter from '@tomasruizr/flyd/module/filter';
import { dropRepeats } from '@tomasruizr/flyd/module/droprepeats';
export function once <T>( stream$: flyd.Stream<T> ): flyd.Stream<T> {
  return flyd.combine( function ( s$, self ) {
    self( s$());
    self.end( true );
  }, [stream$]);
};

export function bufferCount<T>( bufferSize: number, source: flyd.Stream<T> ): flyd.Stream<T>;
export function bufferCount<T>( bufferSize: number, bufferEvery: number, source: flyd.Stream<T> ): flyd.Stream<T[]>;
export function bufferCount<T>( bufferSize: number, bufferEvery: number|flyd.Stream<T>, source?: flyd.Stream<T> ): flyd.Stream<T[]> {
  if ( flyd.isStream( bufferEvery )) {
    source = bufferEvery as flyd.Stream<T>;
    bufferEvery = bufferSize;
  }
  let buffer = [];
  return flyd.combine( function( source, self ) {
    buffer.push( source());
    if ( buffer.length === bufferSize ) {
      self( buffer );
      buffer = bufferEvery ? buffer.slice( bufferEvery as number ) : buffer = [];
    }
  }, [source]);
};

export function skip <T>( count: number, stream: flyd.Stream<T> ) : flyd.Stream<T> | ((stream:flyd.Stream<T>) => flyd.Stream<T>|Function) {
  if (!stream) return (stream : flyd.Stream<T>) => skip(count, stream);
  return flyd.combine( function( s, self ) {
    if ( count <= 0 ) {
      self( s());
    } else {
      count--;
    }
  }, [stream]);
};

export function getReadOnly <T>( originalStream: flyd.Stream<T> ){
  return flyd.combine( x=>x(), [originalStream]);
}

declare type S = typeof import('@tomasruizr/flyd');
export interface Stream extends S {
  filter: typeof filter
  dedupe: typeof dropRepeats
  once: typeof once
  skip: typeof skip
  bufferCount: typeof bufferCount
  getReadOnly: typeof getReadOnly
}

export default {
  ...flyd,
  filter,
  dedupe: dropRepeats,
  once,
  skip,
  bufferCount,
  getReadOnly,
} as Stream;
