import { GravitySimulator } from "../src/GravitySimulator";
import { Coordinate } from "../src/Coord";
import { expect } from "chai";

describe( 'GravitySimulator', () =>
{
    let testSubject: GravitySimulator;

    const initialPositions = [
        new Coordinate( -1, 0, 2 ),
        new Coordinate( 2, -10, -7 ),
        new Coordinate( 4, -8, 8 ),
        new Coordinate( 3, 5, -1 )
    ];

    const expectedSimulationStatesAtEachStep = [

    ]

    beforeEach( () =>
    {
        testSubject = new GravitySimulator( initialPositions );
    } );

    it( 'Computes new positions across multiple steps', () =>
    {
        let actualStates = Array( expectedSimulationStatesAtEachStep.length );

        for ( let i = 0; i < expectedSimulationStatesAtEachStep.length; i++ )
        {
            actualStates[i] = testSubject.calcSimulationStep();

            expect( actualStates[i] ).to.deep.equal( expectedSimulationStatesAtEachStep[i] );
        }

    } );
} );