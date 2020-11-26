// Test framework dependencies
const expect = require( 'chai' ).expect;
import { AsteroidDetector } from '../src/AsteroidDetector';

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
            expect( result.bestStationCoords.getId() ).to.equal( '3,4,0' );
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
            expect( result.bestStationCoords.getId() ).to.equal( '5,8,0' )
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
            expect( result.bestStationCoords.getId() ).to.equal( '1,2,0' )
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
            expect( result.bestStationCoords.getId() ).to.equal( '6,3,0' )
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
            expect( result.bestStationCoords.getId() ).to.equal( '11,13,0' )
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
                    '8,1,0', // Start of first rotation
                    '9,0,0',
                    '9,1,0',
                    '10,0,0',
                    '9,2,0',
                    '11,1,0',
                    '12,1,0',
                    '11,2,0',
                    '15,1,0',
                    '12,2,0', // second set of 9
                    '13,2,0',
                    '14,2,0',
                    '15,2,0',
                    '12,3,0',
                    '16,4,0',
                    '15,4,0',
                    '10,4,0',
                    '4,4,0',
                    '2,4,0', // Third set of 9
                    '2,3,0',
                    '0,2,0',
                    '1,2,0',
                    '0,1,0',
                    '1,1,0',
                    '5,2,0',
                    '1,0,0',
                    '5,1,0'
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

            expect( asteroidDestructionOrder[0] ).to.equal( '11,12,0,0' );
            expect( asteroidDestructionOrder[1] ).to.equal( '12,1,0,0' );
            expect( asteroidDestructionOrder[2] ).to.equal( '12,2,0,0' );
            expect( asteroidDestructionOrder[9] ).to.equal( '12,8,0,0' );
            expect( asteroidDestructionOrder[19] ).to.equal( '16,0,0,0' );
            expect( asteroidDestructionOrder[49] ).to.equal( '16,9,0,0' );
            expect( asteroidDestructionOrder[99] ).to.equal( '10,16,0,0' );
            expect( asteroidDestructionOrder[198] ).to.equal( '9,6,0,0' );
            expect( asteroidDestructionOrder[199] ).to.equal( '8,2,0,0' );
            expect( asteroidDestructionOrder[200] ).to.equal( '10,9,0,0' );
            expect( asteroidDestructionOrder[298] ).to.equal( '11,1,0,0' );
            expect( asteroidDestructionOrder.length ).to.equal( 299 );
        } );
    } );
} );