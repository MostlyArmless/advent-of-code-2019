import { readFileAsBigIntArray } from "../tools";
import { IntCodeComputer } from "../IntCodeComputer";
import { MockStdIn } from "../Mocks/MockStdIn";
import { MockStdOut } from "../Mocks/MockStdOut";
import { Memory } from "../Memory";

const problem9input: bigint[] = readFileAsBigIntArray( './src/ProblemsAndInputs/problem9input.txt' );

export async function problem9a(): Promise<bigint>
{
    const mockStdIn = new MockStdIn<bigint>( [1n] );
    const mockStdOut = new MockStdOut<bigint>();
    const computer = new IntCodeComputer( new Memory(), mockStdIn, mockStdOut, false );

    computer.loadProgram( problem9input );
    await computer.runProgram();

    console.log( mockStdOut.outputs );
    const answer = mockStdOut.outputs[0];
    console.log( `Answer to problem 9 = ${answer}` );
    return answer;
}

export async function problem9b(): Promise<bigint>
{
    const mockStdIn = new MockStdIn<bigint>( [2n] );
    const mockStdOut = new MockStdOut<bigint>();
    const computer = new IntCodeComputer( new Memory(), mockStdIn, mockStdOut, false );

    computer.loadProgram( problem9input );
    await computer.runProgram();

    console.log( mockStdOut.outputs );
    const answer = mockStdOut.outputs[0];
    console.log( `Answer to problem 9 = ${answer}` );
    return answer;
}