import { measureExecutionTime, readFileAsArrayOfLines } from "./tools";
import { AsteroidDetector } from "./AsteroidDetector";

const problem10input = readFileAsArrayOfLines( './problem10input.txt' );
function problem10a()
{
    const asteroidDetector = new AsteroidDetector( problem10input );
    const newMonitoringLocation = asteroidDetector.findBestMonitoringLocation();
    console.log( newMonitoringLocation );
    // console.log( `Answer to problem 10a = ${newMonitoringLocation.asteroidsVisibleFromStation.length}` );
}

measureExecutionTime( problem10a );