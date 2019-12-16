import { measureExecutionTime } from "./tools";
import { problem8input } from './problem8input';
import { ImageDecoder } from "./ImageDecoder";

async function problem8a()
{
    const imageWidth = 25;
    const imageHeight = 6;

    const imageDecoder = new ImageDecoder( imageHeight, imageWidth, problem8input );
    // Find the layer that contains the fewest 0 digits. On that layer, what is the number of 1 digits multiplied by the number of 2 digits?
    console.log( `Problem 8a answer = ${imageDecoder.getChecksum()}` );
}

measureExecutionTime( problem8a );
// measureExecutionTime( problem8b );