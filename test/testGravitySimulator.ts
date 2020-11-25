import { GravitySimulator } from "../src/GravitySimulator";
import { Vector } from "../src/interfaces";
import { expect } from "chai";

describe( 'GravitySimulator', () =>
{
    let gravSim: GravitySimulator;
    const testCoords: Vector[] =
        [
            [-1, 0, 2],
            [2, -10, -7],
            [4, -8, 8],
            [3, 5, -1]
        ];

    beforeEach( () =>
    {
        gravSim = new GravitySimulator( testCoords );
    } );

    it( 'Constructs properly', () =>
    {
        expect( gravSim.bodies.length ).to.equal( 4 );

        expect( gravSim.bodies[0].getId() ).to.equal( '-1,0,2' );
        expect( gravSim.bodies[1].getId() ).to.equal( '2,-10,-7' );
        expect( gravSim.bodies[2].getId() ).to.equal( '4,-8,8' );
        expect( gravSim.bodies[3].getId() ).to.equal( '3,5,-1' );
    } );
} );