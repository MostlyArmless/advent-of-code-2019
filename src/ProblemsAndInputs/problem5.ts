import { readFileAsBigIntArray } from "../tools";
import { IntCodeComputer } from "../IntCodeComputer";
import { MockStdIn } from "../Mocks/MockStdIn";
import { MockStdOut } from "../Mocks/MockStdOut";
import { Memory } from "../Memory";

const testDiagnosticProgram = readFileAsBigIntArray( './src/ProblemsAndInputs/problem5input.txt' );

const enableLogging = false;

export async function problem5a(): Promise<bigint>
{
    const airConditionerSystemId = 1n;
    const mockStdOut = new MockStdOut<bigint>();
    const computer = new IntCodeComputer(
        new Memory(),
        new MockStdIn( [airConditionerSystemId] ),
        mockStdOut,
        enableLogging );

    computer.loadProgram( testDiagnosticProgram );
    await computer.runProgram();

    const answer = mockStdOut.outputs.slice( -1 );
    console.log( `Problem 5a answer = ${answer}` );
    return answer[0];
}

export async function problem5b(): Promise<bigint>
{
    const thermalRadiatorControllerId = 5n;
    const mockStdOut = new MockStdOut<bigint>();
    const computer = new IntCodeComputer(
        new Memory(),
        new MockStdIn( [thermalRadiatorControllerId] ),
        mockStdOut,
        enableLogging );

    computer.loadProgram( testDiagnosticProgram );
    await computer.runProgram();
    const answer = mockStdOut.outputs.slice( -1 );
    console.log( `Problem 5b answer = ${answer}` );
    return answer[0];
}