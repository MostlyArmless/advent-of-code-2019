import { measureExecutionTime } from "./tools";
import { problem7input } from './problem7input';
import { AmplifierArray } from "./AmplifierArray";

function problem7a()
{
    const numAmplifiers = 5;
    const inputSignal = 0;

    const enableLogging = false;
    const ampArray = new AmplifierArray( numAmplifiers, problem7input, enableLogging );
    const { maxOutput, bestPhaseSequence } = ampArray.findMaxPossibleOutput( inputSignal );
    console.log( `Problem 7a answer:\nMax output = ${maxOutput}, at phase sequence = ${bestPhaseSequence}` );
}

measureExecutionTime( problem7a );