// Test framework dependencies
const expect = require( 'chai' ).expect;
import * as chai from 'chai';
import { Queue } from '../Queue';
chai.use( require( 'chai-as-promised' ) ); // Extension that defines the "eventually" keyword
chai.use( require( 'chai-string' ) ); // Extension that provides the "string should contain" functionality

describe( 'Queue', () =>
{
    describe( 'Pop', () =>
    {
        it( 'Pop When Nonempty should return immediately', async () =>
        {
            const testSubject = new Queue();
            testSubject.pushBack( 1 );
            const result = await testSubject.popFront();
            expect( result ).to.equal( 1 );
        } );
    } );
} );