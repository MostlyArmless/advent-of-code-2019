import { measureExecutionTime, readFileAsArrayOfLines } from "../tools";
import { AsteroidDetector } from "../AsteroidDetector";

const problem10input = readFileAsArrayOfLines( './src/ProblemsAndInputs/problem10input.txt' );

export function problem10a(): number
{
    const asteroidDetector = new AsteroidDetector( problem10input );
    const newMonitoringLocation = asteroidDetector.findBestMonitoringLocation();
    const answer = newMonitoringLocation.asteroidsVisibleFromBestStation.size;

    console.log( `Answer to problem 10a = ${answer}` );
    return answer;
}

export function problem10b(): number
{
    const asteroidDetector = new AsteroidDetector( problem10input );
    const asteroidDestructionOrder = asteroidDetector.calculateLaserFiringOrder();
    const twoHundredthAsteroidToBeDestroyed = asteroidDestructionOrder[199];

    const xy = twoHundredthAsteroidToBeDestroyed.split( ',' );
    const answer = parseInt( xy[0] ) * 100 + parseInt( xy[1] );

    console.log( `Answer to problem 10b = ${answer}` );
    return answer;
}

measureExecutionTime( problem10a );
measureExecutionTime( problem10b );