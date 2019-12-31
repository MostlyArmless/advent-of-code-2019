import { measureExecutionTime } from "../tools";
import { problem7input } from './problem7input';
import { AmplifierArray } from "../AmplifierArray";

export async function problem7a(): Promise<bigint>
{
    const numAmplifiers = 5;
    const inputSignal = 0;

    const enableLogging = false;
    const ampArray = new AmplifierArray( numAmplifiers, 'serial', problem7input, enableLogging );
    const { maxOutput, bestPhaseSequence } = await ampArray.findMaxPossibleOutput( inputSignal );
    console.log( `Problem 7a answer:\nMax output = ${maxOutput}, at phase sequence = ${bestPhaseSequence}` );
    return maxOutput;
}

export async function problem7b(): Promise<bigint>
{
    const numAmplifiers = 5;
    const inputSignal = 0;

    const enableLogging = false;
    const ampArray = new AmplifierArray( numAmplifiers, 'feedback', problem7input, enableLogging );
    const { maxOutput, bestPhaseSequence } = await ampArray.findMaxPossibleOutput( inputSignal );
    console.log( `Problem 7b answer:\nMax output = ${maxOutput}, at phase sequence = ${bestPhaseSequence}` );
    return maxOutput;
}

measureExecutionTime( problem7a );
measureExecutionTime( problem7b );