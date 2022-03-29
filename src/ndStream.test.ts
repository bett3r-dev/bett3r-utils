import {ndStream} from './ndStream';
import Stream from './stream'

describe( 'ndStream', function() {
  it( 'processes a string ending in new line as a full record', done => {
    const docStream = Stream.stream<string>();
    ndStream( docStream ).map( doc => {
      expect( doc ).toEqual('hola,pana,mio' );
      done ();
    });
    docStream( 'hola,pana,mio\n' );
  });
  it( 'processes a string ending in new line as a full record', done => {
    const docStream = Stream.stream<string>();
    const results = [];
    ndStream( docStream ).map( doc => {
      results.push( doc );
    });
    docStream( 'hola,pana,mio1\n' );
    docStream( 'hola,pana,mio2\n' );
    docStream( 'hola,pana,mio3\n' );
    expect( results).toEqual( [
      'hola,pana,mio1',
      'hola,pana,mio2',
      'hola,pana,mio3',
    ]);
    done();
  });
  it( 'accumulates a string not parseable and waits for the next iteration to complete', done => {
    const docStream = Stream.stream<string>();
    const results = [];
    ndStream( docStream ).map( doc => {
      results.push( doc );
    });
    docStream( 'hola,pana' );
    docStream( ',mio1\nh' );
    docStream( 'ola,pana,mio2\nhola,pana,mio3\n' );
    expect( results).toEqual ([
      'hola,pana,mio1',
      'hola,pana,mio2',
      'hola,pana,mio3',
    ]);
    done();
  });
  it( 'accumulates a string not parseable and waits for the next iteration to complete', done => {
    const docStream = Stream.stream<string>();
    const results = [];
    ndStream( docStream ).map( doc => {
      results.push( doc );
    });
    docStream( 'hola,pana' );
    docStream( ',mio1\nh' );
    docStream( 'ola,pana,mio2\nhola,pana,mio3\n' );
    docStream( 'hola,pana,mio4\n' );
    docStream( 'hola,pana,mio5\n' );
    docStream( 'hola,pana,mio6\n' );
    docStream( 'hola,pana,mio7\n' );
    docStream( 'hola,pana' );
    docStream( ',mio8\nh' );
    docStream( 'ola,pana,mio9\nhola,pana,mio10\n' );
    docStream( 'hola,pana,mio11\n' );
    docStream( 'hola,pana' );
    docStream( ',mio12\nh' );
    expect( results).toEqual ([
      'hola,pana,mio1',
      'hola,pana,mio2',
      'hola,pana,mio3',
      'hola,pana,mio4',
      'hola,pana,mio5',
      'hola,pana,mio6',
      'hola,pana,mio7',
      'hola,pana,mio8',
      'hola,pana,mio9',
      'hola,pana,mio10',
      'hola,pana,mio11',
      'hola,pana,mio12',
    ]);
    done();
  });
  it( 'accumulates a string not parseable and waits for the next iteration to complete', done => {
    const docStream = Stream.stream<Record<string, any>>();
    const results = [];
    ndStream( docStream, 'message' ).map( doc => {
      results.push( doc );
    });
    docStream({ message:'hola,pana', socket: { name:'tomas' }});
    docStream({ message:',mio1\nh', socket: { name:'tomas' }});
    docStream({ message:'ola,pana,mio2\nhola,pana,mio3\n', socket: { name:'tomas' }});
    docStream({ message:'hola,pana,mio4\n', socket: { name:'tomas' }});
    docStream({ message:'hola,pana,mio5\n', socket: { name:'tomas' }});
    docStream({ message:'hola,pana,mio6\n', socket: { name:'tomas' }});
    docStream({ message:'hola,pana,mio7\n', socket: { name:'tomas' }});
    docStream({ message:'hola,pana', socket: { name:'tomas' }});
    docStream({ message:',mio8\nh', socket: { name:'tomas' }});
    docStream({ message:'ola,pana,mio9\nhola,pana,mio10\n', socket: { name:'tomas' }});
    docStream({ message:'hola,pana,mio11\n', socket: { name:'tomas' }});
    docStream({ message:'hola,pana', socket: { name:'tomas' }});
    docStream({ message:',mio12\nh', socket: { name:'tomas' }});
    expect( results).toEqual ([
      { message:'hola,pana,mio1', socket:{ name:'tomas' }},
      { message:'hola,pana,mio2', socket:{ name:'tomas' }},
      { message:'hola,pana,mio3', socket:{ name:'tomas' }},
      { message:'hola,pana,mio4', socket:{ name:'tomas' }},
      { message:'hola,pana,mio5', socket:{ name:'tomas' }},
      { message:'hola,pana,mio6', socket:{ name:'tomas' }},
      { message:'hola,pana,mio7', socket:{ name:'tomas' }},
      { message:'hola,pana,mio8', socket:{ name:'tomas' }},
      { message:'hola,pana,mio9', socket:{ name:'tomas' }},
      { message:'hola,pana,mio10', socket:{ name:'tomas' }},
      { message:'hola,pana,mio11', socket:{ name:'tomas' }},
      { message:'hola,pana,mio12', socket:{ name:'tomas' }},
    ]);
    done();
  });
});
