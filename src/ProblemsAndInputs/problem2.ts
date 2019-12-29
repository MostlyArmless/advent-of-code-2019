import { IntCodeComputer } from '../IntCodeComputer'
import { measureExecutionTime } from '../tools';
import { HumanInputRetriever } from '../HumanInputRetriever';
import { ConsoleStdOut } from '../ConsoleStdOut';

async function problem2()
{
    const input = [1, 0, 0, 3, 1, 1, 2, 3, 1, 3, 4, 3, 1, 5, 0, 3, 2, 6, 1, 19, 1, 19, 9, 23, 1, 23, 9, 27, 1, 10, 27, 31, 1, 13, 31, 35, 1, 35, 10, 39, 2, 39, 9, 43, 1, 43, 13, 47, 1, 5, 47, 51, 1, 6, 51, 55, 1, 13, 55, 59, 1, 59, 6, 63, 1, 63, 10, 67, 2, 67, 6, 71, 1, 71, 5, 75, 2, 75, 10, 79, 1, 79, 6, 83, 1, 83, 5, 87, 1, 87, 6, 91, 1, 91, 13, 95, 1, 95, 6, 99, 2, 99, 10, 103, 1, 103, 6, 107, 2, 6, 107, 111, 1, 13, 111, 115, 2, 115, 10, 119, 1, 119, 5, 123, 2, 10, 123, 127, 2, 127, 9, 131, 1, 5, 131, 135, 2, 10, 135, 139, 2, 139, 9, 143, 1, 143, 2, 147, 1, 5, 147, 0, 99, 2, 0, 14, 0];

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
    let numAttempts = 0;

    while ( actualOutput != desiredOutput )
    {
        numAttempts += 1;

        ( { arg1, arg2 } = TryNewArgs( arg1, arg2 ) );

        console.log( `Running iteration ${numAttempts}...` );

        computer.loadProgram( input, arg1, arg2 )
        actualOutput = await computer.runProgram();
        console.log( `arg1 = ${arg1}, arg2 = ${arg2}, result = ${actualOutput}` );

    }

    console.log( `DONE. arg1 = ${arg1}, arg2 = ${arg2}. Problem answer = ${100 * arg1 + arg2}` );
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


measureExecutionTime( problem2 );