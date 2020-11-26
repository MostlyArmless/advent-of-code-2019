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
    let mockComputer: MockComputer;
    let robot: PaintingRobot;

    beforeEach( () =>
    {
        camera = new IoBuffer<bigint>();
        nextActions = new IoBuffer<bigint>();
        outputsToSendAfterEachInput = 2;
        mockComputer = new MockComputer( camera, nextActions, outputsToSendAfterEachInput );

        robot = new PaintingRobot( mockComputer, camera, nextActions, MockProgram, LoggingLevel.Verbose );
    } );

    it( 'Sample', async () =>
    {
        mockComputer.setOutputSequence( [
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

        expect( mockComputer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 6 );
    } );

    it( 'Last instruction is paint', async () =>
    {
        mockComputer.setOutputSequence( [
            1n, 1n, // white, right
            1n, 0n, // white, left
            1n, 1n, // white, right
            1n,     // white
        ] );

        await robot.paint();
        const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();
        robot.drawState();

        expect( mockComputer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 4 );
    } );

    it( 'Diagonal up & right', async () =>
    {
        mockComputer.setOutputSequence( [
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

        expect( mockComputer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 10 );
    } );

    it( 'Diagonal up & left', async () =>
    {
        mockComputer.setOutputSequence( [
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

        expect( mockComputer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 9 );
    } );

    it( 'Diagonal down & left', async () =>
    {
        mockComputer.setOutputSequence( [
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

        expect( mockComputer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 10 );
    } );

    it( 'Diagonal down & right', async () =>
    {
        mockComputer.setOutputSequence( [
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

        expect( mockComputer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 11 );
    } );

    it( 'Circle pattern', async () =>
    {
        mockComputer.setOutputSequence( [
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

        expect( mockComputer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 5 );
    } );

    it( 'Circle pattern repeated', async () =>
    {
        mockComputer.setOutputSequence( [
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

        expect( mockComputer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 9 );
    } );

    it( 'Moved right 1', async () =>
    {
        mockComputer.setOutputSequence( [
            1n, 1n, // white, right
        ] );

        await robot.paint();
        const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();
        robot.drawState();

        expect( mockComputer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 1 );
    } );

    it( 'Moved left 1', async () =>
    {
        mockComputer.setOutputSequence( [
            1n, 0n, // white, left
        ] );

        await robot.paint();
        const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();
        robot.drawState();

        expect( mockComputer.outputs.length ).to.equal( 0 );
        expect( numPanelsPaintedAtLeastOnce ).to.equal( 1 );
    } );
} );