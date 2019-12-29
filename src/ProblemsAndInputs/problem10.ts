import { measureExecutionTime, readFileAsArrayOfLines } from "../tools";
import { AsteroidDetector } from "../AsteroidDetector";

const problem10input = readFileAsArrayOfLines( './src/problem10input.txt' );
function problem10a()
{
    const asteroidDetector = new AsteroidDetector( problem10input );
    const newMonitoringLocation = asteroidDetector.findBestMonitoringLocation();
    console.log( `Answer to problem 10a = ${newMonitoringLocation.asteroidsVisibleFromBestStation.size}` );
}

function problem10b()
{
    const asteroidDetector = new AsteroidDetector( problem10input );
    const asteroidDestructionOrder = asteroidDetector.calculateLaserFiringOrder();
    const twoHundredthAsteroidToBeDestroyed = asteroidDestructionOrder[199];

    const xy = twoHundredthAsteroidToBeDestroyed.split( ',' );
    console.log( `Answer to problem 10b = ${parseInt( xy[0] ) * 100 + parseInt( xy[1] )}` );
}

measureExecutionTime( problem10a );
measureExecutionTime( problem10b );