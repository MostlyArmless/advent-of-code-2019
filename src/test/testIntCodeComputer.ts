// Test framework dependencies
// const should = require('chai').should();
const expect = require( 'chai' ).expect;
// const assert = require('chai').assert;
import * as chai from 'chai';
import { IntCodeComputer } from '../IntCodeComputer';
import { MockStdIn } from '../Mocks/MockInputRetriever';
import { MockStdOut } from '../Mocks/MockStdOut';
chai.use( require( 'chai-as-promised' ) ); // Extension that defines the "eventually" keyword
chai.use( require( 'chai-string' ) ); // Extension that provides the "string should contain" functionality

describe( 'IntCodeComputer', () =>
{
    const enableLogging = true;
    let m_mockStdIn: MockStdIn;
    let m_mockStdOut: MockStdOut;
    let m_testSubject: IntCodeComputer;

    beforeEach( () =>
    {
        m_mockStdIn = new MockStdIn( null );
        m_mockStdOut = new MockStdOut();
        m_testSubject = new IntCodeComputer( m_mockStdIn, m_mockStdOut, enableLogging );
    } );

    describe( "ADD and MULTIPLY", () =>
    {
        it( 'ADD and store result at 3', () =>
        {
            const program = [1, 0, 0, 3, 99];
            const expectedMemoryState = [1, 0, 0, 2, 99];
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_testSubject.dumpMemory() ).to.eql( expectedMemoryState );
        } );

        it( 'ADD and MULTIPLY', () =>
        {
            const program = [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50];
            const expectedMemoryState = [3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50];
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_testSubject.dumpMemory() ).to.eql( expectedMemoryState );
        } );

        it( 'ADD and store result at 0', () =>
        {
            const program = [1, 0, 0, 0, 99];
            const expectedMemoryState = [2, 0, 0, 0, 99];
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_testSubject.dumpMemory() ).to.eql( expectedMemoryState );
        } );

        it( 'MULTIPLY and store at 3', () =>
        {
            const program = [2, 3, 0, 3, 99];
            const expectedMemoryState = [2, 3, 0, 6, 99];
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_testSubject.dumpMemory() ).to.eql( expectedMemoryState );
        } );

        it( 'MULTIPLY and store at 5', () =>
        {
            const program = [2, 4, 4, 5, 99, 0];
            const expectedMemoryState = [2, 4, 4, 5, 99, 9801];
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_testSubject.dumpMemory() ).to.eql( expectedMemoryState );
        } );

        it( 'ADD and return before end of program memory', () =>
        {
            const program = [1, 1, 1, 4, 99, 5, 6, 0, 99];
            const expectedMemoryState = [30, 1, 1, 4, 2, 5, 6, 0, 99];
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_testSubject.dumpMemory() ).to.eql( expectedMemoryState );
        } );

        it( 'length-4 MULTIPLY opstring', () =>
        {
            const program = [1002, 4, 3, 4, 33];
            const expectedMemoryState = [1002, 4, 3, 4, 99];
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_testSubject.dumpMemory() ).to.eql( expectedMemoryState );
        } );

        it( 'length 4 ADD opstring', () =>
        {
            const program = [1101, 100, -1, 4, 0];
            const expectedMemoryState = [1101, 100, -1, 4, 99];
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_testSubject.dumpMemory() ).to.eql( expectedMemoryState );
        } );
    } );

    describe( 'STDIN and STDOUT', () =>
    {
        it( 'Take input number and print it', () =>
        {
            const inputValue = 69;
            const mockInputRetriever = new MockStdIn( inputValue );
            const mockStdOut = new MockStdOut();
            let m_testSubject = new IntCodeComputer( mockInputRetriever, mockStdOut, enableLogging );

            m_testSubject.enableLogging = true;
            m_testSubject.loadProgram( [3, 0, 4, 0, 99] );
            m_testSubject.runProgram();
            expect( mockStdOut.outputs ).to.eql( [inputValue] )
        } );
    } );

    describe( 'Jump operators and comparison operators', () =>
    {
        it( 'Equality, position mode, true', () =>
        {
            const program = [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8];
            m_mockStdIn.setInput( 8 );
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_mockStdOut.outputs ).to.eql( [1] );
        } );

        it( 'Equality, position mode, false', () =>
        {
            const program = [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8];
            m_mockStdIn.setInput( 7 );
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_mockStdOut.outputs ).to.eql( [0] );
        } );

        it( 'Less-than, position mode, false', () =>
        {
            const program = [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8];
            m_mockStdIn.setInput( 9 );
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_mockStdOut.outputs ).to.eql( [0] );
        } );

        it( 'Less-than, position mode, true', () =>
        {
            const program = [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8];
            m_mockStdIn.setInput( 7 );
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_mockStdOut.outputs ).to.eql( [1] );
        } );

        it( 'Equal, immediate mode, false', () =>
        {
            const program = [3, 3, 1108, -1, 8, 3, 4, 3, 99];
            m_mockStdIn.setInput( 7 );
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_mockStdOut.outputs ).to.eql( [0] );
        } );

        it( 'Equal, immediate mode, true', () =>
        {
            const program = [3, 3, 1108, -1, 8, 3, 4, 3, 99];
            m_mockStdIn.setInput( 8 );
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_mockStdOut.outputs ).to.eql( [1] );
        } );

        it( 'Less-than, immediate mode, false', () =>
        {
            const program = [3, 3, 1107, -1, 8, 3, 4, 3, 99];
            m_mockStdIn.setInput( 10 );
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_mockStdOut.outputs ).to.eql( [0] );
        } );

        it( 'Less-than, immediate mode, true', () =>
        {
            const program = [3, 3, 1107, -1, 8, 3, 4, 3, 99];
            m_mockStdIn.setInput( 7 );
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_mockStdOut.outputs ).to.eql( [1] );
        } );

        it( 'Jump, position mode, output 0 if input 0, true', () =>
        {
            const program = [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9];
            m_mockStdIn.setInput( 0 );
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_mockStdOut.outputs ).to.eql( [0] );
        } );

        it( 'Jump, position mode, output 0 if input 0, false', () =>
        {
            const program = [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9];
            m_mockStdIn.setInput( -1 );
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_mockStdOut.outputs ).to.eql( [1] );
        } );

        it( 'Jump, immediate mode, output 0 if input 0, true', () =>
        {
            const program = [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1];
            m_mockStdIn.setInput( 0 );
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_mockStdOut.outputs ).to.eql( [0] );
        } );

        it( 'Jump, immediate mode, output 0 if input 0, false', () =>
        {
            const program = [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1];
            m_mockStdIn.setInput( 10 );
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_mockStdOut.outputs ).to.eql( [1] );
        } );

        it( 'Output 999 if input < 8', () =>
        {
            const program = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
                1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
                999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];
            m_mockStdIn.setInput( 7 );
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_mockStdOut.outputs ).to.eql( [999] );
        } );

        it( 'Output 1000 if input == 8', () =>
        {
            const program = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
                1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
                999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];
            m_mockStdIn.setInput( 8 );
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_mockStdOut.outputs ).to.eql( [1000] );
        } );

        it( 'Output 1001 if input > 8', () =>
        {
            const program = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
                1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
                999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];
            m_mockStdIn.setInput( 9 );
            m_testSubject.loadProgram( program );
            m_testSubject.runProgram();
            expect( m_mockStdOut.outputs ).to.eql( [1001] );
        } );
    } );
} );

