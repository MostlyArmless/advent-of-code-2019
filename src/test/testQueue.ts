// Test framework dependencies
const expect = require( 'chai' ).expect;
import * as chai from 'chai';
import { Queue } from '../Queue';
chai.use( require( 'chai-as-promised' ) ); // Extension that defines the "eventually" keyword
chai.use( require( 'chai-string' ) ); // Extension that provides the "string should contain" functionality

describe( 'Queue', () =>
{
    let testSubject: Queue<number>;

    beforeEach( () =>
    {
        testSubject = new Queue<number>();
    } );

    it( 'Pop When Nonempty should return immediately', async () =>
    {
        testSubject.pushBack( 1 );
        const result = await testSubject.popFront();
        expect( result ).to.equal( 1 );
    } );

    it( 'Long wait for a value does not crash Nodejs', async function ()
    {
        const longWait = 1000 * 60 * 2; // Two minute wait
        this.timeout( longWait + 500 );
        const popPromise = testSubject.popFront();

        setTimeout( () =>
        {
            testSubject.pushBack( 5 );
        }, longWait );

        let poppedValue = null;

        const caughtErrorCode = 3;
        try
        {
            poppedValue = await popPromise;
        } catch ( error )
        {
            poppedValue = caughtErrorCode;
        }

        console.log( `value gotted!` );

        expect( poppedValue ).to.equal( caughtErrorCode );
    } );

    it( 'Short wait for a value (less than timeout) returns the value', async function ()
    {
        const shortWait = 450; // just under the time it takes for the Queue to time out
        this.timeout( shortWait + 500 );
        const popPromise = testSubject.popFront();

        setTimeout( () =>
        {
            testSubject.pushBack( 5 );
        }, shortWait );

        let poppedValue = null;

        const caughtErrorCode = 3;
        try
        {
            poppedValue = await popPromise;
        } catch ( error )
        {
            poppedValue = caughtErrorCode;
        }

        console.log( `value gotted!` );

        expect( poppedValue ).to.equal( 5 );
    } );
} );