#!/usr/bin/env node

// CLI syntax example to run problem 2
// npm start -- 3

import { measureExecutionTime } from "./tools";

let problemNumber = parseInt( process.argv[2] );
// let problemNumber = 3; // Uncomment this line instead of the line above in order to run from the debugger. Or pass the args via launch.json.

if ( problemNumber < 2 || problemNumber > 25 )
{
    console.error( `Invalid problem number ${problemNumber}` );
    process.exit();
}

console.log( `Running problemNumber ${problemNumber}...` );
const problemModule = require( `D:/Dev/advent-of-code-2019/build/src/ProblemsAndInputs/problem${problemNumber}.js` );
const exportedFunctionNames = Object.keys( problemModule );

exportedFunctionNames.forEach( func =>
{
    measureExecutionTime( problemModule[func] );
} );