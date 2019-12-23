// Test framework dependencies
const expect = require( 'chai' ).expect;
import * as chai from 'chai';
import { AsteroidDetector } from '../AsteroidDetector';
chai.use( require( 'chai-as-promised' ) ); // Extension that defines the "eventually" keyword
chai.use( require( 'chai-string' ) ); // Extension that provides the "string should contain" functionality

describe( 'AsteroidDetector', () =>
{
    describe( 'Sample tests', () =>
    {
        describe( 'Sample 1', () =>
        {
            let testSubject: AsteroidDetector;
            const asteroidMap1 =
                [
                    '.#..#',
                    '.....',
                    '#####',
                    '....#',
                    '...##'
                ];
            const numAsteroids = 10;

            beforeEach( () =>
            {
                testSubject = new AsteroidDetector( asteroidMap1 );
            } );

            it( 'Constructs graph correctly', () =>
            {
                expect( testSubject.asteroidCoords.length ).to.equal( numAsteroids );
                expect( testSubject.visibilityGraph.adjacencyList.size ).to.equal( numAsteroids );
                expect( testSubject.visibilityGraph.nodeValues.size ).to.equal( numAsteroids );

                expect( testSubject.visibilityGraph.nodeValues ).to.have.all.keys(
                    '1,0',
                    '4,0',
                    '0,2',
                    '1,2',
                    '2,2',
                    '3,2',
                    '4,2',
                    '4,3',
                    '3,4',
                    '4,4'
                );

                testSubject.visibilityGraph.adjacencyList.forEach( ( value, key ) =>
                {
                    expect( value.size, `${key} should have ${numAsteroids} neighbors` ).to.equal( numAsteroids );
                } );
            } );

            it( 'Find best monitoring location', async () =>
            {
                const result = testSubject.findBestMonitoringLocation();
                console.log( result );
                expect( [result.bestStationCoords.x, result.bestStationCoords.y] ).to.deep.equal( [3, 4] );
            } );
        } );

    } );
} );