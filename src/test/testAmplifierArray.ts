// Test framework dependencies
// const should = require('chai').should();
const expect = require( 'chai' ).expect;
// const assert = require('chai').assert;
import * as chai from 'chai';
import { AmplifierArray } from '../AmplifierArray';
chai.use( require( 'chai-as-promised' ) ); // Extension that defines the "eventually" keyword
chai.use( require( 'chai-string' ) ); // Extension that provides the "string should contain" functionality

describe( 'AmplifierArray', () =>
{
    const enableLogging = false;
    const numAmplifiers = 5;
    const inputSignal = 0;

    describe( "Sample programs", () =>
    {
        it( 'Sample 1', () =>
        {
            const program = [3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0];
            const testSubject = new AmplifierArray( numAmplifiers, program, enableLogging );
            const { maxOutput, bestPhaseSequence } = testSubject.findMaxPossibleOutput( inputSignal );
            expect( maxOutput ).to.equal( 43210 );
            expect( bestPhaseSequence ).to.eql( [4, 3, 2, 1, 0] );
        } );

        it( 'Sample 2', () =>
        {
            const program = [3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23,
                101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0];
            const testSubject = new AmplifierArray( numAmplifiers, program, enableLogging );
            const { maxOutput, bestPhaseSequence } = testSubject.findMaxPossibleOutput( inputSignal );
            expect( maxOutput ).to.equal( 54321 );
            expect( bestPhaseSequence ).to.eql( [0, 1, 2, 3, 4] );
        } );

        it( 'Sample 3', () =>
        {
            const program = [3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33,
                1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0];
            const testSubject = new AmplifierArray( numAmplifiers, program, enableLogging );
            const { maxOutput, bestPhaseSequence } = testSubject.findMaxPossibleOutput( inputSignal );
            expect( maxOutput ).to.equal( 65210 );
            expect( bestPhaseSequence ).to.eql( [1, 0, 4, 3, 2] );
        } );
    } );
} );

