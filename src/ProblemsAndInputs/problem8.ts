import { problem8input } from './problem8input';
import { ImageDecoder } from "../ImageDecoder";

const imageWidth = 25;
const imageHeight = 6;

export function problem8a(): number
{
    const imageDecoder = new ImageDecoder( imageWidth, imageHeight, problem8input );
    const answer = imageDecoder.getChecksum();

    console.log( `Problem 8a answer = ${answer}` );
    return answer;
}

export function problem8b()
{
    const imageDecoder = new ImageDecoder( imageWidth, imageHeight, problem8input );

    imageDecoder.saveImageToFile();
    console.log( `Check the file for the answer to problem 8b.` );
}