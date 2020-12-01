#!/usr/bin/env node

// CLI syntax example to run problem 2
// npm start -- 3
import * as path from 'path';
import { readFileAsBigIntArray } from "./tools";
import { measureExecutionTime } from 'func-timer';

let problemNumber = parseInt( process.argv[2] );
// let problemNumber = 11; // Uncomment this line instead of the line above in order to run from the debugger. Or pass the args via launch.json.

if ( problemNumber < 2 || problemNumber > 25 )
{
    console.error( `Invalid problem number ${problemNumber}` );
    process.exit();
}

console.log( `Running problemNumber ${problemNumber}...` );
const problemModule = require( `./ProblemsAndInputs/problem${problemNumber}.js` );
const exportedFunctionNames = Object.keys( problemModule );
const inputDir = "./src/ProblemsAndInputs";
const inputFilename = inputDir + `/problem${problemNumber}input.txt`;
console.log( path.resolve( inputFilename ) );
const problemInput = readFileAsBigIntArray( inputFilename );
exportedFunctionNames.forEach( func =>
{
    measureExecutionTime( problemModule[func], [problemInput] );
} );