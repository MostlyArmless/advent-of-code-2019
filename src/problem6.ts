import { measureExecutionTime } from "./tools";
import { problem6Input } from './problem6Input';
import { OrbitLengthChecker } from "./OrbitLengthChecker";

function problem6a()
{
    const orbitCalculator = new OrbitLengthChecker( problem6Input );
    const result = orbitCalculator.totalNumberOfOrbits();
    console.log( `Answer to problem 6 = ${result}` );
}

measureExecutionTime( problem6a );