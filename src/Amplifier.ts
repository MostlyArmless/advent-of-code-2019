import { IntCodeComputer } from "./IntCodeComputer";
import { IoBuffer } from "./IoBuffer";
import { Memory } from "./Memory";

export class Amplifier
{
    computer: IntCodeComputer;
    program: bigint[];
    outputBuffer: IoBuffer<bigint>;
    inputBuffer: IoBuffer<bigint>;
    enableLogging: boolean;
    iAmp: number;

    constructor( program: bigint[], inputBuffer: IoBuffer<bigint>, outputBuffer: IoBuffer<bigint>, enableLogging: boolean, iAmp: number )
    {
        this.enableLogging = enableLogging;
        this.inputBuffer = inputBuffer;
        this.outputBuffer = outputBuffer;
        this.program = program;
        this.computer = new IntCodeComputer( new Memory(), this.inputBuffer, this.outputBuffer, false, iAmp );
        this.computer.loadProgram( program );
        this.iAmp = iAmp;
    }

    reset(): void
    {
        this.computer.reset();
        this.computer.loadProgram( this.program );
        this.inputBuffer.clear();
        this.outputBuffer.clear();
    }

    setPhase( phaseValue: bigint ): void
    {
        this.inputBuffer.queue.pushBack( BigInt( phaseValue ) );
    }

    async runProgram(): Promise<bigint>
    {
        return await this.computer.runProgram();
    }

    log( msg: string ): void
    {
        if ( this.enableLogging )
            console.log( msg );
    }
}