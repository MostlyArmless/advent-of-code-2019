import { expect } from "chai";
import { measureExecutionTime } from "../src/tools";

import { problem2 } from "../src/ProblemsAndInputs/problem2";
import { problem3a, problem3b } from "../src/ProblemsAndInputs/problem3";
import { problem4a, problem4b } from "../src/ProblemsAndInputs/problem4";
import { problem5a, problem5b } from "../src/ProblemsAndInputs/problem5";
import { problem6a, problem6b } from "../src/ProblemsAndInputs/problem6";
import { problem7a, problem7b } from "../src/ProblemsAndInputs/problem7";
import { problem8a } from "../src/ProblemsAndInputs/problem8";
import { problem9a, problem9b } from "../src/ProblemsAndInputs/problem9";
import { problem10a, problem10b } from "../src/ProblemsAndInputs/problem10";
import { problem11a } from "../src/ProblemsAndInputs/problem11";
import { Memory } from "../src/Memory";

const maxExpectedProblemRuntimeSeconds = 1.5;

describe( 'Advent of Code Problems', () =>
{

    it( 'Problem 2 - IntCodeComputer find desired output', async () =>
    {
        const result = await measureExecutionTime( problem2, [new Memory()] );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.equal( 7603 );
    } );

    it( 'Problem 3a - WireCrosser Manhattan Distance', async () =>
    {
        const result = await measureExecutionTime( problem3a );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.equal( 1225 );
    } );

    it( 'Problem 3b - WireCrosser fewest combined steps', async () =>
    {
        const result = await measureExecutionTime( problem3b );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.equal( 107036 );
    } );

    it( 'Problem 4a - Password cracker', async () =>
    {
        const result = await measureExecutionTime( problem4a );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.equal( 1890 );
    } );

    it( 'Problem 4b - Password cracker', async () =>
    {
        const result = await measureExecutionTime( problem4b );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.equal( 1277 );
    } );

    it( 'Problem 5a - IntCodeComputer diagnostic program', async () =>
    {
        const result = await measureExecutionTime( problem5a );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.deep.equal( 14522484n );
    } );

    it( 'Problem 5b - IntCodeComputer diagnostic program', async () =>
    {
        const result = await measureExecutionTime( problem5b );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.deep.equal( 4655956n );
    } );

    it( 'Problem 6a - OrbitCalculator total number of orbits', async () =>
    {
        const result = await measureExecutionTime( problem6a );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.deep.equal( 204521 );
    } );

    it( 'Problem 6b - OrbitCalculator minimum transfers', async () =>
    {
        const result = await measureExecutionTime( problem6b );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.deep.equal( 307 );
    } );

    it( 'Problem 7a - AmplifierArray', async () =>
    {
        const result = await measureExecutionTime( problem7a );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.deep.equal( 398674n );
    } );

    it( 'Problem 7b - AmplifierArray', async () =>
    {
        const result = await measureExecutionTime( problem7b );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.deep.equal( 39431233n );
    } );

    it( 'Problem 8a - ImageDecoder', async () =>
    {
        const result = await measureExecutionTime( problem8a );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.deep.equal( 1920 );
    } );

    it( 'Problem 9a - IntCodeComputer BOOST program', async () =>
    {
        const result = await measureExecutionTime( problem9a );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.deep.equal( 3512778005n );
    } );

    it( 'Problem 9b - IntCodeComputer BOOST program', async () =>
    {
        const result = await measureExecutionTime( problem9b );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.deep.equal( 35920n );
    } );

    it( 'Problem 10a - AsteroidDetector', async () =>
    {
        const result = await measureExecutionTime( problem10a );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.deep.equal( 326 );
    } );

    it( 'Problem 10b - AsteroidDetector', async () =>
    {
        const result = await measureExecutionTime( problem10b );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.deep.equal( 1623 );
    } );

    it( 'Problem 11a - PainterRobot', async () =>
    {
        const result = await measureExecutionTime( problem11a );
        expect( result.runtimeSeconds ).to.be.lte( maxExpectedProblemRuntimeSeconds );
        expect( result.functionOutput ).to.not.equal( 5279 ); // TODO give this a real criterion. 5279 is the WRONG ANSWER, don't submit it again.
    } );
} );