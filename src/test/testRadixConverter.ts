// Test framework dependencies
const expect = require( 'chai' ).expect;
import * as chai from 'chai';
import { convertDecimalToBaseN } from '../tools';
chai.use( require( 'chai-as-promised' ) ); // Extension that defines the "eventually" keyword
chai.use( require( 'chai-string' ) ); // Extension that provides the "string should contain" functionality

describe( 'RadixConverter', () =>
{
    describe( 'Decimal to base 5', () =>
    {
        it( '0', () =>
        {
            const decimalValue = 0;
            const radix = 5;
            const precision = radix;
            expect( convertDecimalToBaseN( decimalValue, radix, precision ) ).to.equal( '00000' );
        } );

        it( '10', () =>
        {
            const decimalValue = 10;
            const radix = 5;
            const precision = radix;
            expect( convertDecimalToBaseN( decimalValue, radix, precision ) ).to.equal( '00020' );
        } );

        it( '3124', () =>
        {
            const decimalValue = 3124;
            const radix = 5;
            const precision = radix;
            expect( convertDecimalToBaseN( decimalValue, radix, precision ) ).to.equal( '44444' );
        } );
    } );
} );