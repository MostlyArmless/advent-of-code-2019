// Test framework dependencies
const expect = require( 'chai' ).expect;
import * as chai from 'chai';
import { convertRThetaPhiToXyz, convertXyzToRThetaPhi, translateCoords } from '../src/CoordinateTranslator';
import { Coordinate } from '../src/Coord';
chai.use( require( 'chai-as-promised' ) ); // Extension that defines the "eventually" keyword
chai.use( require( 'chai-string' ) ); // Extension that provides the "string should contain" functionality
const chaiAlmost = require( 'chai-almost' );
chai.use( chaiAlmost() );

describe( 'Coordinate Translator', () =>
{
    describe( 'Rectangular to Polar coordinate conversion', () =>
    {
        it( 'Polar', () =>
        {
            const { r, theta } = convertXyzToRThetaPhi( 1, Math.sqrt( 3 ) );
            expect( r ).to.almost.equal( 2 );
            expect( theta ).to.almost.equal( 60 );
        } );

        it( 'Spherical', () =>
        {
            const { r, theta, phi } = convertXyzToRThetaPhi( 1, 1, 1 );
            expect( r ).to.almost.equal( Math.sqrt( 3 ) );
            expect( theta ).to.almost.equal( 45 );
            expect( phi ).to.almost.equal( Math.asin( Math.sqrt( 2 / 3 ) ) * 180 / Math.PI );
        } );
    } );

    describe( 'Spherical To Rectangular', () =>
    {
        it( 'All z', () =>
        {
            const { x, y, z } = convertRThetaPhiToXyz( 5, 0, 0 );
            expect( x ).to.almost.equal( 0 );
            expect( y ).to.almost.equal( 0 );
            expect( z ).to.almost.equal( 5 );
        } );

        it( 'All x', () =>
        {
            const { x, y, z } = convertRThetaPhiToXyz( 5, 0, 90 );
            expect( x ).to.almost.equal( 5 );
            expect( y ).to.almost.equal( 0 );
            expect( z ).to.almost.equal( 0 );
        } );

        it( 'All y', () =>
        {
            const { x, y, z } = convertRThetaPhiToXyz( 5, 90, 90 );
            expect( x ).to.almost.equal( 0 );
            expect( y ).to.almost.equal( 5 );
            expect( z ).to.almost.equal( 0 );
        } );
    } );

    describe( 'Round Trip', () =>
    {
        it( 'Rect->Spherical->Rect', () =>
        {
            const { r, theta, phi } = convertXyzToRThetaPhi( 5, 0, 0 );
            const { x, y, z } = convertRThetaPhiToXyz( r, theta, phi );
            expect( x ).to.almost.equal( 5 );
            expect( y ).to.almost.equal( 0 );
            expect( z ).to.almost.equal( 0 );
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