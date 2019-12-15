import { IntCodeComputer } from "./IntCodeComputer";
import { IoBuffer } from "./IoBuffer";

export class Amplifier
{
    computer: IntCodeComputer;
    program: number[];
    outputBuffer: IoBuffer;
    inputBuffer: IoBuffer;
    enableLogging: boolean;
    iAmp: number;

    constructor( program: number[], inputBuffer: IoBuffer, outputBuffer: IoBuffer, enableLogging: boolean, iAmp: number )
    {
        this.enableLogging = enableLogging;
        this.inputBuffer = inputBuffer;
        this.outputBuffer = outputBuffer;
        this.program = program;
        this.computer = new IntCodeComputer( this.inputBuffer, this.outputBuffer, false );
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

    setPhase( phaseValue: number ): void
    {
        this.inputBuffer.queue.pushBack( phaseValue );
    }

    runProgram(): void
    {
        this.computer.runProgram();
    }

    log( msg: string ): void
    {
        if ( this.enableLogging )
            console.log( msg );
    }
}