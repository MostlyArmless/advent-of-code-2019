// Test framework dependencies
const expect = require( 'chai' ).expect;
import * as chai from 'chai';
import { AsteroidDetector } from '../AsteroidDetector';
chai.use( require( 'chai-as-promised' ) ); // Extension that defines the "eventually" keyword
chai.use( require( 'chai-string' ) ); // Extension that provides the "string should contain" functionality

describe( 'AsteroidDetector', () =>
{
    describe( 'Find the best monitoring location', () =>
    {
        it( 'Basic example', () =>
        {
            const asteroidMap =
                [
                    '.#..#',
                    '.....',
                    '#####',
                    '....#',
                    '...##'
                ];
            const testSubject = new AsteroidDetector( asteroidMap );
            const result = testSubject.findBestMonitoringLocation();
            console.log( result );
            expect( result.bestStationCoords.getAsteroidId() ).to.equal( '3,4' );
        } );

        it( 'Obscuring test', () =>
        {
            const asteroidMap = [
                '#.........',
                '...#......',
                '...#..#...',
                '.####....#',
                '..#.#.#...',
                '.....#....',
                '..###.#.##',
                '.......#..',
                '....#...#.',
                '...#..#..#'
            ];
            const testSubject = new AsteroidDetector( asteroidMap );
            const result = testSubject.findBestMonitoringLocation();
            console.log( result );
            const neighborsOfTopLeftNode = testSubject.visibilityGraph.getNodeNeighborsWithValues( '0,0' );

            expect( neighborsOfTopLeftNode.size ).to.equal( 7 );
            expect( neighborsOfTopLeftNode ).to.have.all.keys(
                '3,1',
                '3,2',
                '1,3',
                '2,3',
                '3,3',
                '4,3',
                '2,4' );
        } );

        it( 'Bigger example 1', () =>
        {
            const asteroidMap = [
                '......#.#.',
                '#..#.#....',
                '..#######.',
                '.#.#.###..',
                '.#..#.....',
                '..#....#.#',
                '#..#....#.',
                '.##.#..###',
                '##...#..#.',
                '.#....####'
            ];

            const testSubject = new AsteroidDetector( asteroidMap );
            const result = testSubject.findBestMonitoringLocation();
            expect( result.asteroidsVisibleFromBestStation.size ).to.equal( 33 );
            expect( result.bestStationCoords.getAsteroidId() ).to.equal( '5,8' )
        } );

        it( 'Bigger example 2', () =>
        {
            const asteroidMap = [
                '#.#...#.#.',
                '.###....#.',
                '.#....#...',
                '##.#.#.#.#',
                '....#.#.#.',
                '.##..###.#',
                '..#...##..',
                '..##....##',
                '......#...',
                '.####.###.'
            ];

            const testSubject = new AsteroidDetector( asteroidMap );
            const result = testSubject.findBestMonitoringLocation();
            expect( result.asteroidsVisibleFromBestStation.size ).to.equal( 35 );
            expect( result.bestStationCoords.getAsteroidId() ).to.equal( '1,2' )
        } );

        it( 'Bigger example 3', () =>
        {
            const asteroidMap = [
                '.#..#..###',
                '####.###.#',
                '....###.#.',
                '..###.##.#',
                '##.##.#.#.',
                '....###..#',
                '..#.#..#.#',
                '#..#.#.###',
                '.##...##.#',
                '.....#.#..'
            ];

            const testSubject = new AsteroidDetector( asteroidMap );
            const result = testSubject.findBestMonitoringLocation();
            expect( result.asteroidsVisibleFromBestStation.size ).to.equal( 41 );
            expect( result.bestStationCoords.getAsteroidId() ).to.equal( '6,3' )
        } );

        it( 'Bigger example 4', () =>
        {
            const asteroidMap = [
                '.#..##.###...#######',
                '##.############..##.',
                '.#.######.########.#',
                '.###.#######.####.#.',
                '#####.##.#.##.###.##',
                '..#####..#.#########',
                '####################',
                '#.####....###.#.#.##',
                '##.#################',
                '#####.##.###..####..',
                '..######..##.#######',
                '####.##.####...##..#',
                '.#####..#.######.###',
                '##...#.##########...',
                '#.##########.#######',
                '.####.#.###.###.#.##',
                '....##.##.###..#####',
                '.#.#.###########.###',
                '#.#.#.#####.####.###',
                '###.##.####.##.#..##'
            ];

            const testSubject = new AsteroidDetector( asteroidMap );
            const result = testSubject.findBestMonitoringLocation();
            expect( result.asteroidsVisibleFromBestStation.size ).to.equal( 210 );
            expect( result.bestStationCoords.getAsteroidId() ).to.equal( '11,13' )
        } );

    } );
} );