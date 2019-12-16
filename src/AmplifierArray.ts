import { Amplifier } from "./Amplifier";
import { IoBuffer } from "./IoBuffer";
import { allPermutations, NumToBigInt } from "./tools";

export type ConnectionMode = 'serial' | 'feedback';

export class AmplifierArray
{
    program: bigint[];
    amps: Amplifier[];
    phaseSequence: number[];
    inputBuffer: IoBuffer<bigint>;
    outputBuffer: IoBuffer<bigint>;
    enableLogging: boolean;
    connectionMode: ConnectionMode;

    constructor( numAmplifiers, connectionMode: ConnectionMode, program: bigint[] | number[], enableLogging: boolean )
    {

        this.program = typeof program[0] === 'bigint' ? program as bigint[] : NumToBigInt( program as number[] );
        this.enableLogging = enableLogging;

        this.inputBuffer = new IoBuffer();
        this.outputBuffer = new IoBuffer();
        this.phaseSequence = Array( numAmplifiers ).fill( null );
        this.connectionMode = connectionMode;

        this.amps = [];
        this.connectAmplifiers( connectionMode, numAmplifiers, this.program, enableLogging );
    }

    private connectAmplifiers( connectionMode: ConnectionMode, numAmplifiers: number, program: bigint[], enableLogging: boolean )
    {
        let firstAmplifierInput = connectionMode === 'serial' ? this.inputBuffer : this.outputBuffer;

        const finalAmplifier = numAmplifiers - 1;
        for ( let i = 0; i < numAmplifiers; i++ )
        {
            const inputBuffer = i === 0 ? firstAmplifierInput : this.amps[i - 1].outputBuffer;
            const outputBuffer = i === finalAmplifier ? this.outputBuffer : new IoBuffer<bigint>();
            this.amps.push( new Amplifier( program, inputBuffer, outputBuffer, enableLogging, i ) );
        }
    }

    reset(): void
    {
        this.amps.forEach( amp => amp.reset() );
        this.inputBuffer.clear();
        this.outputBuffer.clear();
    }

    loadPhaseSequence( phaseSequence: bigint[] ): void
    {
        if ( phaseSequence.length !== this.amps.length )
            throw new Error( `Phase sequence length ${phaseSequence.length} does not match the number of amplifiers in ampArray ${this.amps.length}` );

        for ( let i = 0; i < phaseSequence.length; i++ )
        {
            this.amps[i].setPhase( phaseSequence[i] );
        }
    }

    async runAmplifierProgram( inputSignal: number ): Promise<bigint>
    {
        this.loadInput( inputSignal );
        this.log( 'BEFORE:' );
        this.printBufferContents();

        let amplifierPromises = [];
        this.amps.forEach( amp =>
        {
            amplifierPromises.push( amp.runProgram() );
            this.log( `After step ${amp.iAmp}` );
            this.printBufferContents();
        } );

        await Promise.all( amplifierPromises );

        this.log( 'AFTER:' );
        this.printBufferContents();

        return this.amps.slice( -1 )[0].outputBuffer.queue.popFront()
    }

    private loadInput( inputSignal: number ): void
    {
        switch ( this.connectionMode )
        {
            case 'serial':
                this.inputBuffer.queue.pushBack( BigInt( inputSignal ) );
                break;

            case 'feedback':
                this.outputBuffer.queue.pushBack( BigInt( inputSignal ) );
                break;
        }
    }

    private printBufferContents()
    {
        if ( !this.enableLogging )
            return;

        let msg = '';
        this.amps.map( amp =>
        {
            msg += `Amp ${amp.iAmp} = ${amp.inputBuffer.queue.values}\n`;
        } );
        msg += `Output = ${this.outputBuffer.queue.values}\n`;
        this.log( msg );
    }

    async findMaxPossibleOutput( inputSignal: number )
    {
        const numAmplifiers = this.amps.length;
        let maxOutput = BigInt( Number.MIN_SAFE_INTEGER );
        let uniquePhaseNumbers = this.getPhaseNumbers( numAmplifiers, this.connectionMode );
        const allPossiblePhaseSequences = allPermutations( uniquePhaseNumbers );
        this.log( `Finding maximum possible engine output...` );

        let bestPhaseSequence = Array( numAmplifiers ).fill( 0 );

        for ( let i = 0; i < allPossiblePhaseSequences.length; i++ )
        {
            if ( i % 10 === 0 )
                this.log( `i = ${i}...` );

            this.reset();
            this.loadPhaseSequence( allPossiblePhaseSequences[i] );
            const output = await this.runAmplifierProgram( inputSignal );

            if ( output > maxOutput )
            {
                maxOutput = output;
                bestPhaseSequence = Array.from( allPossiblePhaseSequences[i] );
            }
        }

        return { maxOutput, bestPhaseSequence };
    }

    private getPhaseNumbers( numAmplifiers: number, connectionMode: ConnectionMode )
    {
        let uniquePhaseNumbers = [];
        const iMin = connectionMode === 'serial' ? 0 : 5;
        for ( let i = iMin; i < iMin + numAmplifiers; i++ )
        {
            uniquePhaseNumbers.push( i );
        }
        return uniquePhaseNumbers;
    }

    sendInput( value: bigint ): void
    {
        this.inputBuffer.queue.pushBack( value );
    }

    async getOutput(): Promise<bigint>
    {
        return await this.outputBuffer.queue.popFront();
    }

    log( msg: string ): void
    {
        if ( this.enableLogging )
            console.log( msg );
    }
}