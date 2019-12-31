import { measureExecutionTime } from "../tools";
import { problem6Input } from './problem6Input';
import { OrbitLengthChecker } from "../OrbitLengthChecker";

export function problem6a(): number
{
    const orbitCalculator = new OrbitLengthChecker( problem6Input );
    const result = orbitCalculator.totalNumberOfOrbits();
    console.log( `Answer to problem 6a = ${result}` );
    return result;
}

export function problem6b(): number
{
    const orbitCalculator = new OrbitLengthChecker( problem6Input );
    const result = orbitCalculator.minimumTransfersToSantasParentPlanet();
    console.log( `Answer to problem 6b = ${result}` );
    return result;
}

measureExecutionTime( problem6a );
measureExecutionTime( problem6b );