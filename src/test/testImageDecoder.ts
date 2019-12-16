import { ImageDecoder } from "../ImageDecoder";

// Test framework dependencies
const expect = require( 'chai' ).expect;

describe( 'ImageDecoder', () =>
{
    it( 'Sample 1', () =>
    {
        const encodedData = '123456789012';
        const imageWidth = 3;
        const imageHeight = 2;

        const testSubject = new ImageDecoder( imageWidth, imageHeight, encodedData );

        expect( testSubject.getChecksum() ).to.equal( 1 );
    } );

    it( 'Custom 1', () =>
    {
        const encodedData = '023456089012112211';
        const imageWidth = 3;
        const imageHeight = 2;

        const testSubject = new ImageDecoder( imageWidth, imageHeight, encodedData );

        expect( testSubject.getChecksum() ).to.equal( 8 );
    } );
} );

