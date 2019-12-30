// Test framework dependencies
const expect = require( 'chai' ).expect;
import { IntCodeComputer } from '../IntCodeComputer';
import { MockStdIn } from '../Mocks/MockStdIn';
import { MockStdOut } from '../Mocks/MockStdOut';
import { BigIntToNum, readProblemTextAsBigIntArray } from '../tools';

describe( 'IntCodeComputer', () =>
{
    const enableLogging = true;
    let m_mockStdIn: MockStdIn<bigint>;
    let m_mockStdOut: MockStdOut<bigint>;
    let m_testSubject: IntCodeComputer;

    beforeEach( () =>
    {
        m_mockStdIn = new MockStdIn( null );
        m_mockStdOut = new MockStdOut();
        m_testSubject = new IntCodeComputer( m_mockStdIn, m_mockStdOut, enableLogging );
    } );

    describe( "ADD and MULTIPLY", () =>
    {
        it( 'ADD and store result at 3', async () =>
        {
            const program = [1, 0, 0, 3, 99];
            const expectedMemoryState = [1, 0, 0, 2, 99];
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( m_testSubject.dumpMemoryAsNumbers() ).to.eql( expectedMemoryState );
        } );

        it( 'ADD and MULTIPLY', async () =>
        {
            const program = [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50];
            const expectedMemoryState = [3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50];
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( m_testSubject.dumpMemoryAsNumbers() ).to.eql( expectedMemoryState );
        } );

        it( 'ADD and store result at 0', async () =>
        {
            const program = [1, 0, 0, 0, 99];
            const expectedMemoryState = [2, 0, 0, 0, 99];
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( m_testSubject.dumpMemoryAsNumbers() ).to.eql( expectedMemoryState );
        } );

        it( 'MULTIPLY and store at 3', async () =>
        {
            const program = [2, 3, 0, 3, 99];
            const expectedMemoryState = [2, 3, 0, 6, 99];
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( m_testSubject.dumpMemoryAsNumbers() ).to.eql( expectedMemoryState );
        } );

        it( 'MULTIPLY and store at 5', async () =>
        {
            const program = [2, 4, 4, 5, 99, 0];
            const expectedMemoryState = [2, 4, 4, 5, 99, 9801];
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( m_testSubject.dumpMemoryAsNumbers() ).to.eql( expectedMemoryState );
        } );

        it( 'ADD and return before end of program memory', async () =>
        {
            const program = [1, 1, 1, 4, 99, 5, 6, 0, 99];
            const expectedMemoryState = [30, 1, 1, 4, 2, 5, 6, 0, 99];
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( m_testSubject.dumpMemoryAsNumbers() ).to.eql( expectedMemoryState );
        } );

        it( 'length-4 MULTIPLY opstring', async () =>
        {
            const program = [1002, 4, 3, 4, 33];
            const expectedMemoryState = [1002, 4, 3, 4, 99];
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( m_testSubject.dumpMemoryAsNumbers() ).to.eql( expectedMemoryState );
        } );

        it( 'length 4 ADD opstring', async () =>
        {
            const program = [1101, 100, -1, 4, 0];
            const expectedMemoryState = [1101, 100, -1, 4, 99];
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( m_testSubject.dumpMemoryAsNumbers() ).to.eql( expectedMemoryState );
        } );
    } );

    describe( 'STDIN and STDOUT', () =>
    {
        it( 'Take input number and print it', async () =>
        {
            const inputValue = 69n;
            const mockInputRetriever = new MockStdIn( [inputValue] );
            const mockStdOut = new MockStdOut();
            let m_testSubject = new IntCodeComputer( mockInputRetriever, mockStdOut, enableLogging );

            m_testSubject.enableLogging = true;
            m_testSubject.loadProgram( [3, 0, 4, 0, 99] );
            await m_testSubject.runProgram();
            expect( mockStdOut.outputs ).to.eql( [inputValue] )
        } );
    } );

    describe( 'Jump operators and comparison operators', () =>
    {
        it( 'Equality, position mode, true', async () =>
        {
            const program = [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8];
            m_mockStdIn.setInput( [8n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [1] );
        } );

        it( 'Equality, position mode, false', async () =>
        {
            const program = [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8];
            m_mockStdIn.setInput( [7n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [0] );
        } );

        it( 'Less-than, position mode, false', async () =>
        {
            const program = [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8];
            m_mockStdIn.setInput( [9n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [0] );
        } );

        it( 'Less-than, position mode, true', async () =>
        {
            const program = [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8];
            m_mockStdIn.setInput( [7n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [1] );
        } );

        it( 'Equal, immediate mode, false', async () =>
        {
            const program = [3, 3, 1108, -1, 8, 3, 4, 3, 99];
            m_mockStdIn.setInput( [7n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [0] );
        } );

        it( 'Equal, immediate mode, true', async () =>
        {
            const program = [3, 3, 1108, -1, 8, 3, 4, 3, 99];
            m_mockStdIn.setInput( [8n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [1] );
        } );

        it( 'Less-than, immediate mode, false', async () =>
        {
            const program = [3, 3, 1107, -1, 8, 3, 4, 3, 99];
            m_mockStdIn.setInput( [10n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [0] );
        } );

        it( 'Less-than, immediate mode, true', async () =>
        {
            const program = [3, 3, 1107, -1, 8, 3, 4, 3, 99];
            m_mockStdIn.setInput( [7n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [1] );
        } );

        it( 'Jump, position mode, output 0 if input 0, true', async () =>
        {
            const program = [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9];
            m_mockStdIn.setInput( [0n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [0] );
        } );

        it( 'Jump, position mode, output 0 if input 0, false', async () =>
        {
            const program = [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9];
            m_mockStdIn.setInput( [-1n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [1] );
        } );

        it( 'Jump, immediate mode, output 0 if input 0, true', async () =>
        {
            const program = [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1];
            m_mockStdIn.setInput( [0n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [0] );
        } );

        it( 'Jump, immediate mode, output 0 if input 0, false', async () =>
        {
            const program = [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1];
            m_mockStdIn.setInput( [10n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [1] );
        } );

        it( 'Output 999 if input < 8', async () =>
        {
            const program = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
                1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
                999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];
            m_mockStdIn.setInput( [7n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [999] );
        } );

        it( 'Output 1000 if input == 8', async () =>
        {
            const program = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
                1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
                999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];
            m_mockStdIn.setInput( [8n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [1000] );
        } );

        it( 'Output 1001 if input > 8', async () =>
        {
            const program = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
                1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
                999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];
            m_mockStdIn.setInput( [9n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [1001] );
        } );

        it( 'Sample program from problem 7, A = 0, B = 0', async () =>
        {
            const program = [3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0];
            // B = (B*10)
            // A = A + B
            // print(A)
            m_mockStdIn.setInput( [0n, 0n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [0] );
        } );

        it( 'Sample program from problem 7, A = 7, B = 11', async () =>
        {
            const program = [3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0];
            // input = (input*10)
            // phase = phase + input
            // print(phase)
            m_mockStdIn.setInput( [7n, 11n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( [117] );
        } );
    } );

    describe( 'RelativeOffset', () =>
    {
        it( 'Program that prints itself', async () =>
        {
            const program = [
                109, 1, // Increment the relative base by 1
                204, -1, // Output the value at address 'relBase - 1"
                1001, 100, 1, 100, // Add the value at address 100 to the immediate '1'
                1008, 100, 16, 101, // if the value at address 100 == 16, store 1 at address 101
                1006, 101, 0, // If the value at address 101 == 0, jump to 0
                99 // End
            ];
            m_testSubject.loadProgram( program );

            await m_testSubject.runProgram();
            expect( BigIntToNum( m_mockStdOut.outputs ) ).to.eql( program );
        } );

        it( 'Output 16 digit number', async () =>
        {
            const program = [1102, 34915192, 34915192, 7, 4, 7, 99, 0];

            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();

            expect( m_mockStdOut.outputs[0].toString().length ).to.equal( 16 );
        } );

        it( 'Output large number', async () =>
        {
            const program = [104, 1125899906842624, 99];
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();

            expect( m_mockStdOut.outputs[0] ).to.equal( BigInt( program[1] ) );
        } );

        it( 'STDIN in relative mode', async () =>
        {
            const program = [
                109, 3, // Set the relative base to 4
                1101, 6, 7, 5, // Add 6+7, store at 5
                203, 2, // Take input, store at relBase-1 = 4-1
                1006, 5, 13, // If the value at address 5 == 0, jump to 0
                104, 69, // Output 69 (shouldn't get here if it's working)
                99 // End
            ];
            m_mockStdIn.setInput( [0n] );
            m_testSubject.loadProgram( program );
            await m_testSubject.runProgram();

            expect( m_mockStdOut.outputs.length ).to.equal( 0 );
        } );
    } );

    describe( 'BOOST test program', () =>
    {
        const problem9input: bigint[] = readProblemTextAsBigIntArray( './src/ProblemsAndInputs/problem9input.txt' );

        it( 'Diagnostic mode', async () =>
        {
            m_mockStdIn.setInput( [1n] );
            m_testSubject.loadProgram( problem9input );
            await m_testSubject.runProgram();

            expect( m_mockStdOut.outputs ).to.eql( [3512778005n] );
        } );
    } );
} );

