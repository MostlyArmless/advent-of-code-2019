// Test framework dependencies
const expect = require( 'chai' ).expect;
import { AmplifierArray } from '../AmplifierArray';

describe( 'AmplifierArray', () =>
{
    const enableLogging = true;
    const numAmplifiers = 5;
    const inputSignal = 0;

    describe( "Sample programs", () =>
    {
        describe( 'Serially connected amplifiers', () =>
        {
            it( 'Serial 1', async () =>
            {
                const program = [3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0];
                const testSubject = new AmplifierArray( numAmplifiers, 'serial', program, enableLogging );
                const { maxOutput, bestPhaseSequence } = await testSubject.findMaxPossibleOutput( inputSignal );
                expect( maxOutput ).to.equal( 43210n );
                expect( bestPhaseSequence ).to.eql( [4, 3, 2, 1, 0] );
            } );

            it( 'Serial 2', async () =>
            {
                const program = [3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23,
                    101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0];
                const testSubject = new AmplifierArray( numAmplifiers, 'serial', program, enableLogging );
                const { maxOutput, bestPhaseSequence } = await testSubject.findMaxPossibleOutput( inputSignal );
                expect( maxOutput ).to.equal( 54321n );
                expect( bestPhaseSequence ).to.eql( [0, 1, 2, 3, 4] );
            } );

            it( 'Serial 3', async () =>
            {
                const program = [3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33,
                    1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0];
                const testSubject = new AmplifierArray( numAmplifiers, 'serial', program, enableLogging );
                const { maxOutput, bestPhaseSequence } = await testSubject.findMaxPossibleOutput( inputSignal );
                expect( maxOutput ).to.equal( 65210n );
                expect( bestPhaseSequence ).to.eql( [1, 0, 4, 3, 2] );
            } );
        } );

        describe( 'Feedback-connected amplifiers', () =>
        {
            it( 'Feedback 1', async () =>
            {
                const program = [3, 26, 1001, 26, -4, 26, 3, 27, 1002, 27, 2, 27, 1, 27, 26,
                    27, 4, 27, 1001, 28, -1, 28, 1005, 28, 6, 99, 0, 0, 5];
                const testSubject = new AmplifierArray( numAmplifiers, 'feedback', program, enableLogging );
                const { maxOutput, bestPhaseSequence } = await testSubject.findMaxPossibleOutput( inputSignal );
                expect( maxOutput ).to.equal( 139629729n );
                expect( bestPhaseSequence ).to.eql( [9, 8, 7, 6, 5] );
            } );

            it( 'Feedback 2', async () =>
            {
                const program = [3, 52, 1001, 52, -5, 52, 3, 53, 1, 52, 56, 54, 1007, 54, 5, 55, 1005, 55, 26, 1001, 54,
                    -5, 54, 1105, 1, 12, 1, 53, 54, 53, 1008, 54, 0, 55, 1001, 55, 1, 55, 2, 53, 55, 53, 4,
                    53, 1001, 56, -1, 56, 1005, 56, 6, 99, 0, 0, 0, 0, 10];
                const testSubject = new AmplifierArray( numAmplifiers, 'feedback', program, enableLogging );
                const { maxOutput, bestPhaseSequence } = await testSubject.findMaxPossibleOutput( inputSignal );
                expect( maxOutput ).to.equal( 18216n );
                expect( bestPhaseSequence ).to.eql( [9, 7, 8, 5, 6] );
            } );
        } );
    } );
} );

