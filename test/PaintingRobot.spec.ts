const expect = require( 'chai' ).expect;

import { IoBuffer } from "../src/IoBuffer";
import { PaintingRobot } from "../src/PaintingRobot";
import { MockComputer } from "../src/Mocks/MockComputer";
import { MockProgram } from "../src/Mocks/Mocks";
import { LoggingLevel } from "../src/interfaces";

describe( 'PaintingRobot', () =>
{
    let camera: IoBuffer<bigint>;
    let nextActions: IoBuffer<bigint>;
    let outputsToSendAfterEachInput: number;
    let computer: MockComputer;
    let robot: PaintingRobot;

    beforeEach( () =>
    {
        camera = new IoBuffer<bigint>();
        nextActions = new IoBuffer<bigint>();
        outputsToSendAfterEachInput = 2;
        computer = new MockComputer( camera, nextActions, outputsToSendAfterEachInput );

        robot = new PaintingRobot( computer, camera, nextActions, MockProgram, LoggingLevel.Off );
    } );

    it( 'Sample', async () =>
    {
        computer.setOutputSequence( [
            1n, 0n, // white, left
            0n, 0n, // black, left
            1n, 0n, // white, left
            1n, 0n, // white, left -> back to origin
            0n, 1n, // black, right
            1n, 0n, // white, left
            1n, 0n // white, left
        ] );

        await robot.paint();
        const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();
        robot.drawState();

        expect( computer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 6 );
    } );

    it( 'Diagonal up & right', async () =>
    {
        computer.setOutputSequence( [
            1n, 1n, // white, right
            1n, 0n, // white, left
            1n, 1n, // white, right
            1n, 0n, // white, left
            1n, 1n, // white, right
            1n, 0n, // white, left
            1n, 1n, // white, right
            1n, 0n, // white, left
            1n, 1n, // white, right
            1n, 0n, // white, left
        ] );

        await robot.paint();
        const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();
        robot.drawState();

        expect( computer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 10 );
    } );

    it( 'Diagonal up & left', async () =>
    {
        computer.setOutputSequence( [
            1n, 0n, // white, left
            1n, 1n, // white, right
            1n, 0n, // white, left
            1n, 1n, // white, right
            1n, 0n, // white, left
            1n, 1n, // white, right
            1n, 0n, // white, left
            1n, 1n, // white, right
            1n, 0n, // white, left
        ] );

        await robot.paint();
        const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();
        robot.drawState();

        expect( computer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 9 );
    } );

    it( 'Diagonal down & left', async () =>
    {
        computer.setOutputSequence( [
            1n, 0n, // white, left
            1n, 0n, // white, left
            0n, 1n, // black, right
            0n, 0n, // black, left
            0n, 1n, // black, right
            0n, 0n, // black, left
            0n, 1n, // black, right
            1n, 0n, // white, left
            1n, 1n, // white, right
            1n, 0n, // white, left
        ] );

        await robot.paint();
        const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();
        robot.drawState();

        expect( computer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 10 );
    } );

    it( 'Diagonal down & right', async () =>
    {
        computer.setOutputSequence( [
            1n, 1n, // white, right
            1n, 1n, // white, right
            1n, 0n, // white, left
            1n, 1n, // white, right
            1n, 0n, // white, left
            1n, 1n, // white, right
            1n, 0n, // white, left
            1n, 1n, // white, right
            1n, 0n, // white, left
            1n, 1n, // white, right
            1n, 0n, // white, left
        ] );

        await robot.paint();
        const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();
        robot.drawState();

        expect( computer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 11 );
    } );

    it( 'Circle pattern', async () =>
    {
        computer.setOutputSequence( [
            1n, 1n, // white, right
            1n, 0n, // white, left
            1n, 0n, // white, left
            1n, 0n, // white, left
            1n, 1n, // white, right
            1n, 1n, // white, right
        ] );

        await robot.paint();
        const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();
        robot.drawState();

        expect( computer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 5 );
    } );

    it( 'Circle pattern repeated', async () =>
    {
        computer.setOutputSequence( [
            0n, 1n, // black, right
            0n, 0n, // black, left
            0n, 0n, // black, left
            0n, 0n, // black, left
            0n, 1n, // black, right
            0n, 1n, // black, right
            0n, 1n, // black, right
            0n, 0n, // black, left
            0n, 0n, // black, left
            0n, 0n, // black, left
            0n, 1n, // black, right
            0n, 1n, // black, right
        ] );

        await robot.paint();
        const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();
        robot.drawState();

        expect( computer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 9 );
    } );

    it( 'Moved right 1', async () =>
    {
        computer.setOutputSequence( [
            1n, 1n, // white, right
        ] );

        await robot.paint();
        const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();
        robot.drawState();

        expect( computer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 1 );
    } );

    it( 'Moved left 1', async () =>
    {
        computer.setOutputSequence( [
            1n, 0n, // white, left
        ] );

        await robot.paint();
        const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();
        robot.drawState();

        expect( computer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 1 );
    } );
} );