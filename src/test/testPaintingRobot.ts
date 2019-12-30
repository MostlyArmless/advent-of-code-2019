const expect = require( 'chai' ).expect;

import { IoBuffer } from "../IoBuffer";
import { PaintingRobot } from "../PaintingRobot";
import { MockComputer } from "./MockComputer";
import { MockProgram } from "./Mocks";

describe( 'PaintingRobot', () =>
{
    it( 'Sample', async () =>
    {
        const camera = new IoBuffer<bigint>();
        const nextActions = new IoBuffer<bigint>();
        const outputsToSendAfterEachInput = 2;
        const computer = new MockComputer( camera, nextActions, outputsToSendAfterEachInput );

        computer.setOutputSequence( [
            1n, 0n, // white, left
            0n, 0n, // black, left
            1n, 0n, // white, left
            1n, 0n, // white, left -> back to origin
            0n, 1n, // black, right
            1n, 0n, // white, left
            1n, 0n // white, left
        ] );

        const robot = new PaintingRobot( computer, camera, nextActions, MockProgram );

        await robot.paint();
        const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();

        expect( computer.outputs.length ).to.equal( 0 );
        // expect( computer.receivedInputs ).to.deep.equal( [
        //     0n,
        //     0n,
        //     0n,
        //     1n,
        //     0n,
        //     0n,
        //     0n
        // ] );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 6 );
    } );
} );