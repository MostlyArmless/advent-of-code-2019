// Test framework dependencies
const expect = require( 'chai' ).expect;
import * as chai from 'chai';
import { convertXyToRTheta, translateCoords } from '../CoordinateTranslator';
import { AsteroidCoord } from '../Coord';
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
            const { r, theta } = convertXyToRTheta( 1, Math.sqrt( 3 ) );
            expect( r ).to.almost.equal( 2 );
            expect( theta ).to.almost.equal( 60 * Math.PI / 180 );
        } );
    } );

    it( 'Translate xy coords to new origin', () =>
    {
        const pointToTranslate = new AsteroidCoord( 1, 1 );
        const newOrigin = new AsteroidCoord( 2, 2 );
        const expectedResult = new AsteroidCoord( -1, -1 );
        const result = translateCoords( newOrigin, pointToTranslate )
        expect( result ).to.deep.equal( expectedResult )
    } );
} );