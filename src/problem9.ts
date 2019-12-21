import { measureExecutionTime, readProblemTextAsBigIntArray } from "./tools";
import { IntCodeComputer } from "./IntCodeComputer";
import { MockStdIn } from "./Mocks/MockStdIn";
import { MockStdOut } from "./Mocks/MockStdOut";

const problem9input: bigint[] = readProblemTextAsBigIntArray( './src/problem9input.txt' );

async function problem9a()
{
    const mockStdIn = new MockStdIn<bigint>( [1n] );
    const mockStdOut = new MockStdOut<bigint>();
    const computer = new IntCodeComputer( mockStdIn, mockStdOut, false );

    computer.loadProgram( problem9input );
    await computer.runProgram();

    console.log( mockStdOut.outputs );
    console.log( `Answer to problem 9 = ${mockStdOut.outputs[0]}` );
}

async function problem9b()
{
    const mockStdIn = new MockStdIn<bigint>( [2n] );
    const mockStdOut = new MockStdOut<bigint>();
    const computer = new IntCodeComputer( mockStdIn, mockStdOut, false );

    computer.loadProgram( problem9input );
    await computer.runProgram();

    console.log( mockStdOut.outputs );
    console.log( `Answer to problem 9 = ${mockStdOut.outputs[0]}` );
}

measureExecutionTime( problem9a );
measureExecutionTime( problem9b );