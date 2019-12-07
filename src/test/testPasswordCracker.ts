// Test framework dependencies
// const should = require('chai').should();
const expect = require( 'chai' ).expect;
// const assert = require('chai').assert;
import * as chai from 'chai';
import { hasPairOfMatchingDigits, hasPairOfMatchingDigitsNotPartOfLargerGroup } from '../problem4';
chai.use( require( 'chai-as-promised' ) ); // Extension that defines the "eventually" keyword
chai.use( require( 'chai-string' ) ); // Extension that provides the "string should contain" functionality
let itParam = require( 'mocha-param' );

interface PasswordCrackerTestDatum
{
    input: number;
    expectedOutput: boolean;
}

const testDataA: PasswordCrackerTestDatum[] = [
    {
        input: 111111,
        expectedOutput: true
    },
    {
        input: 223450,
        expectedOutput: true
    },
    {
        input: 120382,
        expectedOutput: false
    },
    {
        input: 203822,
        expectedOutput: true
    }
];

const testDataB: PasswordCrackerTestDatum[] = [
    {
        input: 111111,
        expectedOutput: false
    },
    {
        input: 223450,
        expectedOutput: true
    },
    {
        input: 120382,
        expectedOutput: false
    },
    {
        input: 203822,
        expectedOutput: true
    },
    {
        input: 111244,
        expectedOutput: true
    },
    {
        input: 111444,
        expectedOutput: false
    }
];

describe.only( 'PasswordCracker', () =>
{
    itParam( 'hasPairOfMatchingDigits', testDataA, ( value: PasswordCrackerTestDatum ) =>
    {
        expect( hasPairOfMatchingDigits( value.input.toString() ) ).to.equal( value.expectedOutput );
    } );

    itParam( 'hasPairOfMatchingDigitsNotPartOfLargerGroup', testDataB, ( value: PasswordCrackerTestDatum ) =>
    {
        expect( hasPairOfMatchingDigitsNotPartOfLargerGroup( value.input.toString() ) ).to.equal( value.expectedOutput );
    } );
} );