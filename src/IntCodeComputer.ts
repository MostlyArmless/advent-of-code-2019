import { IStdIn, IStdOut, IComputer } from './interfaces';
import { Memory } from './Memory';
import { InstructionParser } from './InstructionParser';

export enum ParamMode
{
    Position,
    Immediate,
    Relative
}

export enum OpCode
{
    Add = 1,
    Multiply = 2,
    StdIn = 3,
    StdOut = 4,
    JumpIfTrue = 5,
    JumpIfFalse = 6,
    LessThan = 7,
    Equals = 8,
    RelativeBaseOffset = 9,
    End = 99
}

export interface IInstruction
{
    opCode: OpCode;
    params: bigint[];
    paramModes: ParamMode[];
    resultAddress: bigint;
    distanceToNextInstruction: number; // Amount you need to increment the program counter by to reach the next instruction
}

export class IntCodeComputer implements IComputer
{
    enableLogging: boolean = false;
    memory: Memory;
    pos: bigint;
    isRunning: boolean;
    params: bigint[];
    paramModes: ParamMode[];
    resultAddress: bigint;
    numInstructionsProcessed: number;
    stdIn: IStdIn<bigint>;
    stdOut: IStdOut<bigint>;
    id: number;
    relativeBase: bigint;
    instructionParser: InstructionParser;

    constructor( stdIn: IStdIn<bigint>, stdOut: IStdOut<bigint>, enableLogging?: boolean, id?: number )
    {
        if ( enableLogging != undefined )
            this.enableLogging = enableLogging;

        this.reset();
        this.stdIn = stdIn;
        this.stdOut = stdOut;
        this.id = id === undefined ? 0 : id;
    }

    reset(): void
    {
        this.memory = new Memory();
        this.pos = 0n;
        this.isRunning = true;
        this.params = [null, null, null, null];
        this.paramModes = [null, null, null, null]
        this.numInstructionsProcessed = 0;
        this.resultAddress = null;
        this.relativeBase = 0n;
        this.instructionParser = new InstructionParser( this.memory, this.enableLogging );
    }

    private log( msg: string ): void
    {
        if ( this.enableLogging )
            console.log( msg );
    }

    private async runNextInstruction(): Promise<void>
    {
        this.log( `pos = ${this.pos}` );
        const instruction = this.instructionParser.parse( this.pos, this.relativeBase );
        let nextInstructionAddress = this.pos + BigInt( instruction.distanceToNextInstruction );

        const params = instruction.params;

        switch ( instruction.opCode )
        {
            case OpCode.Add:
                {
                    this.Add( params[0], params[1], instruction.resultAddress );
                    break;
                }
            case OpCode.Multiply:
                {
                    this.Multiply( params[0], params[1], instruction.resultAddress );
                    break;
                }
            case OpCode.StdIn:
                {
                    try
                    {
                        await this.ReadFromStdIn( instruction.resultAddress );
                    }
                    catch ( error )
                    {
                        throw new Error( "Failed to read from STDIN" );
                    }

                    break;
                }
            case OpCode.StdOut:
                {
                    this.WriteToStdOut( params[0] );
                    break;
                }
            case OpCode.JumpIfTrue:
                {
                    nextInstructionAddress = this.JumpIfTrue( params[0], params[1], nextInstructionAddress );
                    break;
                }
            case OpCode.JumpIfFalse:
                {
                    nextInstructionAddress = this.JumpIfFalse( params[0], params[1], nextInstructionAddress );
                    break;
                }
            case OpCode.LessThan:
                {
                    this.LessThan( params[0], params[1], instruction.resultAddress );
                    break;
                }
            case OpCode.Equals:
                {
                    this.Equals( params[0], params[1], instruction.resultAddress );
                    break;
                }
            case OpCode.RelativeBaseOffset:
                {
                    this.RelativeBaseOffset( params[0] );
                    break;
                }
            case 99: // END
                {
                    this.isRunning = false;
                    break;
                }
            default:
                {
                    console.error( `Attempted to run invalid instruction '${instruction.opCode}' at position ${this.pos}` );
                    this.isRunning = false;
                }
        }

        // Increment the program counter
        this.pos = nextInstructionAddress;
        this.numInstructionsProcessed += 1;
        this.log( "" ); // To visually separate different instructions
    }

    private Multiply( A: bigint, B: bigint, resultAddress: bigint ): void
    {
        this.log( `Storing ${A} * ${B} at address ${resultAddress}` );
        this.memory.store( resultAddress, A * B );
    }

    private Add( A: bigint, B: bigint, resultAddress: bigint ): void
    {
        this.log( `Storing ${A} + ${B} at address ${resultAddress}` );
        this.memory.store( resultAddress, A + B );
    }

    private async ReadFromStdIn( resultAddress: bigint ): Promise<void>
    {
        const input = BigInt( await this.stdIn.getInput() );

        this.log( `Storing value ${input} at address ${resultAddress}` );
        this.memory.store( resultAddress, input );
    }

    private WriteToStdOut( valueToPrint: bigint ): void
    {
        this.stdOut.sendOutput( valueToPrint );
    }

    private JumpIfTrue( param: bigint, jumpAddress: bigint, nextInstructionAddress: bigint )
    {
        if ( param !== 0n )
            return jumpAddress;
        else
            return nextInstructionAddress;
    }

    private JumpIfFalse( param: bigint, jumpAddress: bigint, nextInstructionAddress: bigint )
    {
        if ( param === 0n )
            return jumpAddress;
        else
            return nextInstructionAddress;
    }

    private LessThan( A: bigint, B: bigint, resultAddress: bigint )
    {
        this.memory.store( resultAddress, A < B ? 1n : 0n );
    }

    private Equals( A: bigint, B: bigint, resultAddress: bigint )
    {
        this.memory.store( resultAddress, A === B ? 1n : 0n );
    }

    private RelativeBaseOffset( increment: bigint )
    {
        this.relativeBase += increment;
    }

    loadProgram( program: bigint[] | number[], arg1?: bigint | number, arg2?: bigint | number ): void
    {
        this.memory.loadProgram( program ); // Copy the input array, don't take it by reference.
        if ( arg1 != undefined )
            this.memory.store( 1n, BigInt( arg1 ) );

        if ( arg2 != undefined )
            this.memory.store( 2n, BigInt( arg2 ) );

        this.pos = 0n;
        this.isRunning = true;
    }

    async runProgram(): Promise<bigint>
    {
        while ( this.isRunning )
        {
            await this.runNextInstruction();
        }

        this.log( `Finished running after ${this.numInstructionsProcessed} steps.` );
        this.log( `Final memory state = ${this.memory.dumpRamOnly()}` );
        this.log( `Result = ${this.memory.load( 0n )}` );
        return this.memory.load( 0n );
    }

    clearMemory(): void
    {
        this.memory.reset();
    }

    dumpMemory(): bigint[]
    {
        return this.memory.dumpRamOnly();
    }

    dumpMemoryAsNumbers(): number[]
    {
        return this.memory.dumpRamOnly().map( val => Number( val ) );
    }
}