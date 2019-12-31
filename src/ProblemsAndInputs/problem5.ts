import { measureExecutionTime, readProblemTextAsBigIntArray } from "../tools";
import { IntCodeComputer } from "../IntCodeComputer";
import { MockStdIn } from "../Mocks/MockStdIn";
import { MockStdOut } from "../Mocks/MockStdOut";

const testDiagnosticProgram = readProblemTextAsBigIntArray( './src/ProblemsAndInputs/problem5input.txt' );

const enableLogging = false;

export async function problem5a(): Promise<bigint>
{
    const airConditionerSystemId = 1n;
    const mockStdOut = new MockStdOut<bigint>();
    const computer = new IntCodeComputer(
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
        new MockStdIn( [thermalRadiatorControllerId] ),
        mockStdOut,
        enableLogging );

    computer.loadProgram( testDiagnosticProgram );
    await computer.runProgram();
    const answer = mockStdOut.outputs.slice( -1 );
    console.log( `Problem 5b answer = ${answer}` );
    return answer[0];
}

measureExecutionTime( problem5a );
measureExecutionTime( problem5b );