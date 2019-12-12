// Test framework dependencies
const expect = require( 'chai' ).expect;
import { OrbitLengthChecker } from '../OrbitLengthChecker';

describe( 'OrbitChecker', () =>
{
    const orbits = [
        "COM)B",
        "B)C",
        "C)D",
        "D)E",
        "E)F",
        "B)G",
        "G)H",
        "D)I",
        "E)J",
        "J)K",
        "K)L"
    ];

    it( 'Nodes given in descending order', () =>
    {
        const testSubject = new OrbitLengthChecker( orbits );
        expect( testSubject.totalNumberOfOrbits() ).to.equal( 42 );
    } );
} );