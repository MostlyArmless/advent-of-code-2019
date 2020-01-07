// Test framework dependencies
const expect = require( 'chai' ).expect;
import * as chai from 'chai';
import { convertRectToPolar, translateCoords } from '../CoordinateTranslator';
import { Coordinate } from '../Coord';
chai.use( require( 'chai-as-promised' ) ); // Extension that defines the "eventually" keyword
chai.use( require( 'chai-string' ) ); // Extension that provides the "string should contain" functionality
const chaiAlmost = require( 'chai-almost' );
chai.use( chaiAlmost() );

describe( 'Coordinate Translator', () =>
{
    describe( 'Rectangular to Polar coordinate conversion', () =>
    {
        it( 'Quadrant 1', () =>
        {
            const { r, theta } = convertRectToPolar( 1, Math.sqrt( 3 ) );
            expect( r ).to.almost.equal( 2 );
            expect( theta ).to.almost.equal( 60 );
        } );
    } );

    it( 'Translate xy coords to new origin', () =>
    {
        const pointToTranslate = new Coordinate( 1, 1 );
        const newOrigin = new Coordinate( 2, 2 );
        const expectedResult = new Coordinate( -1, -1 );
        const result = translateCoords( newOrigin, pointToTranslate )
        expect( result ).to.deep.equal( expectedResult )
    } );
} );