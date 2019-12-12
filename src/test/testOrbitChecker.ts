// Test framework dependencies
const expect = require( 'chai' ).expect;
import { OrbitLengthChecker } from '../OrbitLengthChecker';
import * as shuffle from 'shuffle-array';

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

    describe( 'Builds Tree Correctly', () =>
    {
        it( 'Nodes given in descending order', () =>
        {
            const testSubject = new OrbitLengthChecker( orbits );
            const tree = testSubject.getTree();
            const leaves = tree.GetAllLeafNodes();
            expect( leaves.size ).to.equal( 4 );
            let leafNames = [];
            for ( const leaf of leaves )
            {
                leafNames.push( leaf.name );
            }

            expect( leafNames.sort() ).to.eql( ['H', 'I', 'F', 'L'].sort() );
        } );

        it( 'Nodes given in reverse order', () =>
        {
            const testSubject = new OrbitLengthChecker( orbits.reverse() );
            const tree = testSubject.getTree();
            const leaves = tree.GetAllLeafNodes();
            expect( leaves.size ).to.equal( 4 );
            let leafNames = [];
            for ( const leaf of leaves )
            {
                leafNames.push( leaf.name );
            }

            expect( leafNames.sort() ).to.eql( ['H', 'I', 'F', 'L'].sort() );
        } );

        it( 'Nodes given in scrambled order', () =>
        {
            const shuffledInput = shuffle( orbits, { 'copy': true } );
            const testSubject = new OrbitLengthChecker( shuffledInput );
            const tree = testSubject.getTree();
            const leaves = tree.GetAllLeafNodes();
            expect( leaves.size ).to.equal( 4 );
            let leafNames = [];
            for ( const leaf of leaves )
            {
                leafNames.push( leaf.name );
            }

            expect( leafNames.sort() ).to.eql( ['H', 'I', 'F', 'L'].sort() );
        } );
    } );


    describe( 'totalNumberOfOrbits', () =>
    {
        it( 'Nodes given in descending order', () =>
        {
            const testSubject = new OrbitLengthChecker( orbits );
            expect( testSubject.totalNumberOfOrbits() ).to.equal( 42 );
        } );

        it( 'Nodes given in reverse order', () =>
        {
            const testSubject = new OrbitLengthChecker( orbits.reverse() );
            expect( testSubject.totalNumberOfOrbits() ).to.equal( 42 );
        } );

        it( 'Nodes given in scrambled order', () =>
        {
            const shuffledInput = shuffle( orbits, { 'copy': true } );
            const testSubject = new OrbitLengthChecker( shuffledInput );
            console.log( `Shuffled input array:\n${shuffledInput}` );
            expect( testSubject.totalNumberOfOrbits() ).to.equal( 42 );
        } );
    } );

    describe( 'minimumTransfersToSantasParentPlanet', () =>
    {
        it( 'Nodes given in descending order', () =>
        {
            const testSubject = new OrbitLengthChecker( orbits );
            const result = testSubject.minimumTransfersToSantasParentPlanet();

            expect( result ).to.equal( 4 );
        } );
    } );
} );
