import { Amplifier } from "./Amplifier";
import { IoBuffer } from "./IoBuffer";
import { allPermutations } from "./tools";

export class AmplifierArray
{
    program: number[];
    amps: Amplifier[];
    phaseSequence: number[];
    inputBuffer: IoBuffer;
    outputBuffer: IoBuffer;
    enableLogging: boolean;

    constructor( numAmplifiers: number, program: number[], enableLogging: boolean )
    {
        this.program = program;
        this.enableLogging = enableLogging;

        this.inputBuffer = new IoBuffer();
        this.outputBuffer = new IoBuffer();
        this.phaseSequence = Array( numAmplifiers ).fill( null );

        this.amps = [];
        const finalAmplifier = numAmplifiers - 1;
        for ( let i = 0; i < numAmplifiers; i++ )
        {
            const inputBuffer = i === 0 ? this.inputBuffer : this.amps[i - 1].outputBuffer;
            const outputBuffer = i === finalAmplifier ? this.outputBuffer : new IoBuffer();
            this.amps.push( new Amplifier( program, inputBuffer, outputBuffer, enableLogging, i ) );
        }
    }

    reset(): void
    {
        this.amps.forEach( amp => amp.reset() );
        this.inputBuffer.clear();
        this.outputBuffer.clear();
    }

    loadPhaseSequence( phaseSequence: number[] ): void
    {
        if ( phaseSequence.length !== this.amps.length )
            throw new Error( `Phase sequence length ${phaseSequence.length} does not match the number of amplifiers in ampArray ${this.amps.length}` );

        for ( let i = 0; i < phaseSequence.length; i++ )
        {
            this.amps[i].setPhase( phaseSequence[i] );
        }
    }

    runAmplifierProgram( inputSignal: number ): number
    {
        this.inputBuffer.queue.pushBack( 0 ); // Input to the first Amplifier is zero
        this.log( 'BEFORE:' );
        this.printBufferContents();
        this.amps.forEach( amp =>
        {
            amp.runProgram();
            this.log( `After step ${amp.iAmp}` );
            this.printBufferContents();
        } );

        this.log( 'AFTER:' );
        this.printBufferContents();

        return this.amps.slice( -1 )[0].outputBuffer.queue.popFront()
    }

    private printBufferContents()
    {
        let msg = '';
        this.amps.map( amp =>
        {
            msg += `Amp ${amp.iAmp} = ${amp.inputBuffer.queue.values}\n`;
        } );
        msg += `Output = ${this.outputBuffer.queue.values}\n`;
        this.log( msg );
    }

    findMaxPossibleOutput( inputSignal: number )
    {
        const numAmplifiers = this.amps.length;
        let maxOutput = Number.MIN_SAFE_INTEGER;
        let uniquePhaseNumbers = [];
        for ( let i = 0; i < numAmplifiers; i++ )
        {
            uniquePhaseNumbers.push( i );
        }
        const allPossiblePhaseSequences = allPermutations( uniquePhaseNumbers );
        this.log( `Finding maximum possible engine output...` );

        let bestPhaseSequence = Array( numAmplifiers ).fill( 0 );

        for ( let i = 0; i < allPossiblePhaseSequences.length; i++ )
        {
            if ( i % 10 === 0 )
                this.log( `i = ${i}...` );

            this.reset();
            this.loadPhaseSequence( allPossiblePhaseSequences[i] );
            const output = this.runAmplifierProgram( inputSignal );

            if ( output > maxOutput )
            {
                maxOutput = output;
                bestPhaseSequence = Array.from( allPossiblePhaseSequences[i] );
            }
        }

        return { maxOutput, bestPhaseSequence };
    }

    sendInput( value: number ): void
    {
        this.inputBuffer.queue.pushBack( value );
    }

    getOutput(): number
    {
        return this.outputBuffer.queue.popFront();
    }

    log( msg: string ): void
    {
        if ( this.enableLogging )
            console.log( msg );
    }
}