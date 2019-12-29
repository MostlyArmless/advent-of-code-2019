import { measureExecutionTime } from "../tools";
import { problem6Input } from './problem6Input';
import { OrbitLengthChecker } from "../OrbitLengthChecker";

function problem6a()
{
    const orbitCalculator = new OrbitLengthChecker( problem6Input );
    const result = orbitCalculator.totalNumberOfOrbits();
    console.log( `Answer to problem 6a = ${result}` );
}

function problem6b()
{
    const orbitCalculator = new OrbitLengthChecker( problem6Input );
    const result = orbitCalculator.minimumTransfersToSantasParentPlanet();
    console.log( `Answer to problem 6b = ${result}` );
}

measureExecutionTime( problem6a );
measureExecutionTime( problem6b );