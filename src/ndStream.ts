import { assoc, map, prop } from 'rambda';
import Stream from './stream';

const getLines = ( last:string, row: string ) =>{
  const arr = ( last + row ).split( '\n' ); 
  if (arr.length === 1){
    return [arr];
  }
  return [arr.slice( -1 ), arr.slice( 0,-1 )]
}

const processData = ( lastIncomplete = '', data: string ) =>
  getLines( lastIncomplete, data );

export function ndStream( dataStream: flyd.Stream<string|object>, mapProp?: string ) {
  const resultingStream = Stream.stream();
  let lastIncomplete = '';
  dataStream
    .map( data =>{
      const arr = processData( lastIncomplete,  typeof data === 'object' && mapProp ? prop<string, Record<string, any>>( mapProp, data ) : data as string );
      if (arr[1])
        map((row) =>  resultingStream( mapProp ? assoc( mapProp, row, data ) : row ), arr[1])
      lastIncomplete = arr[0][0];
    
    });
  return resultingStream;
}
