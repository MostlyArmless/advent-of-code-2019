// Test framework dependencies
// const should = require('chai').should();
const expect = require( 'chai' ).expect;
// const assert = require('chai').assert;
import * as chai from 'chai';
import { IntCodeComputer } from '../IntCodeComputer';
chai.use( require( 'chai-as-promised' ) ); // Extension that defines the "eventually" keyword
chai.use( require( 'chai-string' ) ); // Extension that provides the "string should contain" functionality
let itParam = require( 'mocha-param' );

const testData = [
    {
        input: [1, 0, 0, 3, 99],
        expectedOutput: [1, 0, 0, 2, 99]
    },
    {
        input: [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50],
        expectedOutput: [3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]
    },
    {
        input: [1, 0, 0, 0, 99],
        expectedOutput: [2, 0, 0, 0, 99]
    },
    {
        input: [2, 3, 0, 3, 99],
        expectedOutput: [2, 3, 0, 6, 99]
    },
    {
        input: [2, 4, 4, 5, 99, 0],
        expectedOutput: [2, 4, 4, 5, 99, 9801]
    },
    {
        input: [1, 1, 1, 4, 99, 5, 6, 0, 99],
        expectedOutput: [30, 1, 1, 4, 2, 5, 6, 0, 99]
    }
];

describe( 'IntCodeComputer', () =>
{
    const enableLogging = false;
    let m_testSubject = new IntCodeComputer( enableLogging );

    beforeEach( () =>
    {
        // Set up tests
        m_testSubject.reset();
    } );

    itParam( 'Running program results in the correct memory state', testData, ( value ) =>
    {
        const program = value.input;
        m_testSubject.loadProgram( program );
        m_testSubject.runProgram();
        const programMemory = m_testSubject.dumpMemory();
        expect( programMemory ).to.eql( value.expectedOutput ); // use 'eql' to check array equality. 'equal' will return false here because the arrays are at different memory locations.
    } );

    afterEach( () =>
    {
        // Tear down tests
    } );
} );

