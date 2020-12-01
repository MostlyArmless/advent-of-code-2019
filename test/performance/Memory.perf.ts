import { expect } from "chai";
import { Memory, MapMemory } from "../../src/Memory";
import { problem2 } from "../../src/ProblemsAndInputs/problem2";
import { measureExecutionTime } from 'func-timer';

// This test won't show up in the TestExplorer. To run it, make sure you build first then run:
// mocha .\build\test\performance\Memory.perf.js

describe( 'Memory performance', () =>
{
    let mem1: Memory;
    let mem2: MapMemory;

    beforeEach( () =>
    {
        mem1 = new Memory();
        mem2 = new MapMemory();
    } );

    it( 'Benchmark using Problem 2', async function ()
    {
        const estimatedSingleExecutionDurationSeconds = 2;
        const numReps = 10;
        this.timeout( estimatedSingleExecutionDurationSeconds * numReps * 1000 * 2 ); // Prevent mocha from throwing, since this test will take longer than the standard 2000ms

        const mem1PerfResults = await measureExecutionTime( problem2, [mem1], numReps );
        const mem2PerfResults = await measureExecutionTime( problem2, [mem2], numReps );

        const betterOrWorse = mem1PerfResults.runtimeSeconds < mem2PerfResults.runtimeSeconds ? "better" : "worse";
        console.log( `Memory implementation '${mem1.constructor.name}' is ${betterOrWorse} than '${mem2.constructor.name}' when benchmarked against problem 2.\nAverage runtimes after ${numReps} reps:` );
        console.log( `'${mem1.constructor.name}' avg runtime = ${mem1PerfResults.runtimeSeconds} s` );
        console.log( `'${mem2.constructor.name}' avg runtime = ${mem2PerfResults.runtimeSeconds} s` );

        expect( mem1PerfResults.runtimeSeconds ).to.be.lte( 2 );
        expect( mem2PerfResults.runtimeSeconds ).to.be.lte( 2 );
    } );
} );