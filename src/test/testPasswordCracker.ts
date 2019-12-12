// Test framework dependencies
// const should = require('chai').should();
const expect = require( 'chai' ).expect;
// const assert = require('chai').assert;
import * as chai from 'chai';
import { hasPairOfMatchingDigits, hasPairOfMatchingDigitsNotPartOfLargerGroup } from '../problem4';
chai.use( require( 'chai-as-promised' ) ); // Extension that defines the "eventually" keyword
chai.use( require( 'chai-string' ) ); // Extension that provides the "string should contain" functionality

describe( 'PasswordCracker', () =>
{
    describe( 'Has Pair of Matching Digits', () =>
    {
        it( 'All ones', () =>
        {
            expect( hasPairOfMatchingDigits( '111111' ) ).to.be.true;
        } );

        it( 'Double at the start', () =>
        {
            expect( hasPairOfMatchingDigits( '223450' ) ).to.be.true;
        } );

        it( 'No double', () =>
        {
            expect( hasPairOfMatchingDigits( '120382' ) ).to.be.false;
        } );

        it( 'Double at the end', () =>
        {
            expect( hasPairOfMatchingDigits( '203822' ) ).to.be.true;
        } );
    } );

    describe( 'Has Pair of Matching Digits Not Part Of Larger Group', () =>
    {
        it( 'All ones', () =>
        {
            expect( hasPairOfMatchingDigitsNotPartOfLargerGroup( '111111' ) ).to.be.false;
        } );

        it( 'Double at the start', () =>
        {
            expect( hasPairOfMatchingDigitsNotPartOfLargerGroup( '223450' ) ).to.be.true;
        } );

        it( 'No double', () =>
        {
            expect( hasPairOfMatchingDigitsNotPartOfLargerGroup( '120382' ) ).to.be.false;
        } );

        it( 'Double at the end', () =>
        {
            expect( hasPairOfMatchingDigitsNotPartOfLargerGroup( '203822' ) ).to.be.true;
        } );

        it( 'Triplet and doublet', () =>
        {
            expect( hasPairOfMatchingDigitsNotPartOfLargerGroup( '111244' ) ).to.be.true;
        } );

        it( 'Two Triplets', () =>
        {
            expect( hasPairOfMatchingDigitsNotPartOfLargerGroup( '111444' ) ).to.be.false;
        } );
    } );
} );