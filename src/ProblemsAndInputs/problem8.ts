import { measureExecutionTime } from "../tools";
import { problem8input } from './problem8input';
import { ImageDecoder } from "../ImageDecoder";

const imageWidth = 25;
const imageHeight = 6;

function problem8a()
{
    const imageDecoder = new ImageDecoder( imageWidth, imageHeight, problem8input );
    // Find the layer that contains the fewest 0 digits. On that layer, what is the number of 1 digits multiplied by the number of 2 digits?
    console.log( `Problem 8a answer = ${imageDecoder.getChecksum()}` );
}

function problem8b()
{
    const imageDecoder = new ImageDecoder( imageWidth, imageHeight, problem8input );
    // for ( let iLayer = 0; iLayer < 100; iLayer++ )
    // {
    //     imageDecoder.printLayer( iLayer );
    // }

    imageDecoder.saveImageToFile();
    console.log( `Check the file for the answer to problem 8b.` );
}

measureExecutionTime( problem8a );
measureExecutionTime( problem8b );