import {branch} from '@bett3r-dev/crocks';
import { assoc, map, prop } from 'rambda';
import Stream from './stream';

const getLines = ( last:string, row: string ) =>
  branch(( last + row ).split( '\n' ))
    .bimap( arr => arr.slice( -1 ), arr => arr.slice( 0,-1 ));

const processData = ( lastIncomplete = '', data: string ) =>
  getLines( lastIncomplete, data );

export function ndStream( dataStream: flyd.Stream<string|object>, mapProp?: string ) {
  const resultingStream = Stream.stream();
  let lastIncomplete = '';
  dataStream.map( data =>lastIncomplete = processData( lastIncomplete,  typeof data === 'object' && mapProp ? prop<string, Record<string, any>>( mapProp, data ) : data as string )
    .map( map( row => resultingStream( mapProp ? assoc( mapProp, row, data ) : row )))
    .fst()[0]
  );
  return resultingStream;
}