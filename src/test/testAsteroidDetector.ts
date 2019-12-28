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

    describe( 'Calculate laser firing order', () =>
    {
        it( 'Small example', () =>
        {
            const asteroidMap = [
                '.#....#####...#..',
                '##...##.#####..##',
                '##...#...#.#####.',
                '..#.....#...###..',
                '..#.#.....#....##'
            ];
            const testSubject = new AsteroidDetector( asteroidMap );
            const asteroidDestructionOrder = testSubject.calculateLaserFiringOrder();

            testSubject.printAsteroidDestructionOrderMap();

            expect( asteroidDestructionOrder.slice( 0, 27 ) ).to.deep.equal(
                [
                    '8,1', // Start of first rotation
                    '9,0',
                    '9,1',
                    '10,0',
                    '9,2',
                    '11,1',
                    '12,1',
                    '11,2',
                    '15,1',
                    '12,2', // second set of 9
                    '13,2',
                    '14,2',
                    '15,2',
                    '12,3',
                    '16,4',
                    '15,4',
                    '10,4',
                    '4,4',
                    '2,4', // Third set of 9
                    '2,3',
                    '0,2',
                    '1,2',
                    '0,1',
                    '1,1',
                    '5,2',
                    '1,0',
                    '5,1'
                ] );
        } );

        it( 'Large example', () =>
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
            const asteroidDestructionOrder = testSubject.calculateLaserFiringOrder();

            expect( asteroidDestructionOrder[0] ).to.equal( '11,12' );
            expect( asteroidDestructionOrder[1] ).to.equal( '12,1' );
            expect( asteroidDestructionOrder[2] ).to.equal( '12,2' );
            expect( asteroidDestructionOrder[9] ).to.equal( '12,8' );
            expect( asteroidDestructionOrder[19] ).to.equal( '16,0' );
            expect( asteroidDestructionOrder[49] ).to.equal( '16,9' );
            expect( asteroidDestructionOrder[99] ).to.equal( '10,16' );
            expect( asteroidDestructionOrder[198] ).to.equal( '9,6' );
            expect( asteroidDestructionOrder[199] ).to.equal( '8,2' );
            expect( asteroidDestructionOrder[200] ).to.equal( '10,9' );
            expect( asteroidDestructionOrder[298] ).to.equal( '11,1' );
            expect( asteroidDestructionOrder.length ).to.equal( 299 );
        } );
    } );
} );