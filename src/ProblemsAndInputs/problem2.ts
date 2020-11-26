import { IntCodeComputer } from '../IntCodeComputer'
import { readFileAsBigIntArray } from '../tools';
import { HumanInputRetriever } from '../HumanInputRetriever';
import { ConsoleStdOut } from '../ConsoleStdOut';

const input = readFileAsBigIntArray( './src/ProblemsAndInputs/problem2input.txt' );

export async function problem2(): Promise<number>
{
    const enableLogging = false;
    const computer = new IntCodeComputer(
        new HumanInputRetriever(),
        new ConsoleStdOut(),
        enableLogging );

    // Determine what pair of inputs produces the output:
    const desiredOutput = 19690720n;
    let actualOutput = 0n;
    let arg1 = 100;
    let arg2 = 99;

    while ( actualOutput != desiredOutput )
    {
        computer.reset();
        ( { arg1, arg2 } = TryNewArgs( arg1, arg2 ) );

        computer.loadProgram( input, arg1, arg2 )
        actualOutput = await computer.runProgram();
    }

    const answer = 100 * arg1 + arg2;
    console.log( `DONE. arg1 = ${arg1}, arg2 = ${arg2}. Problem answer = ${answer}` );
    return answer;
}

function TryNewArgs( arg1: number, arg2: number )
{
    arg1 -= 1;
    if ( arg1 < 0 )
    {
        arg1 = 99;
        arg2 -= 1;
    }
    if ( arg2 < 0 )
    {
        console.log( `Ran all possible combinations and never found the answer` );
        process.exit();
    }
    return { arg1, arg2 };
}