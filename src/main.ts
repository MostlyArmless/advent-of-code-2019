#!/usr/bin/env node

// CLI syntax example to run problem 2
// npm start -- 2

let problemNumber = parseInt( process.argv[2] );
console.log( `Running problemNumber ${problemNumber}...` );


const problem = require( `./ProblemsAndInputs/problem${problemNumber}.js` );

console.log( `DONE.` );