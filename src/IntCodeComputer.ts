import { IStdIn, IStdOut } from './interfaces';
import { GetInstructionInfo } from './InstructionInfoRetriever';

enum ParamMode
{
    Position,
    Immediate
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
    End = 99
}

interface Instruction
{
    opCode: OpCode;
    paramModes: ParamMode[];
    resultAddress: number;
    distanceToNextInstruction: number; // Amount you need to increment the program counter by to reach the next instruction
}

export class IntCodeComputer
{
    enableLogging: boolean = false;
    memory: number[];
    pos: number;
    shouldContinue: boolean;
    params: number[];
    paramModes: ParamMode[];
    resultAddress: number;
    numInstructionsProcessed: number;
    stdIn: IStdIn;
    stdOut: IStdOut;

    constructor( stdIn: IStdIn, stdOut: IStdOut, enableLogging?: boolean )
    {
        if ( enableLogging != undefined )
            this.enableLogging = enableLogging;

        this.reset();
        this.stdIn = stdIn;
        this.stdOut = stdOut;
    }

    reset(): void
    {
        this.memory = [];
        this.pos = 0;
        this.shouldContinue = true;
        this.params = [null, null, null, null];
        this.paramModes = [null, null, null, null]
        this.numInstructionsProcessed = 0;
        this.resultAddress = null;
    }

    private log( msg: string ): void
    {
        if ( this.enableLogging )
            console.log( msg );
    }

    private runNextInstruction(): void
    {
        this.log( `pos = ${this.pos}` );
        const instruction = this.ParseInstruction();
        this.log( `INSTRUCTION = ${instruction.opCode}, Parameter modes = ${instruction.paramModes}` );
        const params = this.GetParams( instruction.paramModes );
        let nextInstructionAddress = this.pos + instruction.distanceToNextInstruction;

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
                    this.ReadFromStdIn( instruction.resultAddress );
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
            case 99: // END
                {
                    this.shouldContinue = false;
                    break;
                }
            default:
                {
                    console.error( `Attempted to run invalid instruction '${instruction.opCode}' at position ${this.pos}` );
                    this.shouldContinue = false;
                }
        }

        // Increment the program counter
        this.pos = nextInstructionAddress;
        this.numInstructionsProcessed += 1;
        this.log( "" ); // To visually separate different instructions
    }



    private ParseInstruction(): Instruction
    {
        const opString = this.memory[this.pos].toString();
        const opCode = parseInt( opString.slice( -2 ) ) as OpCode;
        let paramModes = opString.slice( 0, -2 ).split( '' ).reverse().map( char => parseInt( char ) );

        const instructionInfo = GetInstructionInfo( opCode );

        while ( paramModes.length !== instructionInfo.numParams )
        {
            paramModes.push( 0 );
        }

        return {
            opCode: opCode,
            paramModes: paramModes,
            resultAddress: instructionInfo.storesResult ? this.memory[this.pos + instructionInfo.resultOffset] : null,
            distanceToNextInstruction: instructionInfo.instructionLength
        };
    }

    private GetParams( paramModes: ParamMode[] ): number[]
    {
        let params = Array( paramModes.length );

        for ( let i = 0; i < paramModes.length; i++ )
        {
            switch ( paramModes[i] )
            {
                case ParamMode.Position:
                    {
                        const address = this.memory[this.pos + i + 1];
                        params[i] = this.memory[address];
                        break;
                    }
                case ParamMode.Immediate:
                    {
                        params[i] = this.memory[this.pos + i + 1];
                        break;
                    }
            }
        }

        return params;
    }

    private Multiply( A, B, resultAddress ): void
    {
        this.log( `Storing ${A} * ${B} at address ${resultAddress}` );
        this.memory[resultAddress] = A * B;
    }

    private Add( A, B, resultAddress ): void
    {
        this.log( `Storing ${A} + ${B} at address ${resultAddress}` );
        this.memory[resultAddress] = A + B;
    }

    private ReadFromStdIn( resultAddress ): void
    {
        const input = this.stdIn.getInput();
        if ( input === undefined || input === null || isNaN( input ) )
            throw new Error( "Failed to read a value from STDIN!" );

        this.log( `Storing value ${input} at address ${resultAddress}` );
        this.memory[resultAddress] = input;
    }

    private WriteToStdOut( valueToPrint ): void
    {
        this.stdOut.sendOutput( valueToPrint );
    }

    private JumpIfTrue( param: number, jumpAddress: number, nextInstructionAddress: number )
    {
        if ( param !== 0 )
            return jumpAddress;
        else
            return nextInstructionAddress;
    }

    private JumpIfFalse( param: number, jumpAddress: number, nextInstructionAddress: number )
    {
        if ( param === 0 )
            return jumpAddress;
        else
            return nextInstructionAddress;
    }

    private LessThan( A: number, B: number, resultAddress )
    {
        this.memory[resultAddress] = A < B ? 1 : 0;
    }

    private Equals( A: number, B: number, resultAddress )
    {
        this.memory[resultAddress] = A === B ? 1 : 0;
    }

    loadProgram( program: number[], arg1?: number, arg2?: number ): void
    {
        this.memory = Array.from( program ); // Copy the input array, don't take it by reference.
        if ( arg1 != undefined )
            this.memory[1] = arg1;

        if ( arg2 != undefined )
            this.memory[2] = arg2;

        this.pos = 0;
        this.shouldContinue = true;
    }

    runProgram(): number
    {
        while ( this.shouldContinue )
        {
            this.runNextInstruction();
            // TODO - disable this for performance
            if ( !this.validateMemory() )
            {
                throw new Error( `Memory state invalid!` );
            }
        }

        this.log( `Finished running after ${this.numInstructionsProcessed} steps.` );
        this.log( `Final memory state = ${this.memory}` );
        this.log( `Result = ${this.memory[0]}` );
        return this.memory[0];
    }

    validateMemory(): boolean
    {
        for ( let i = 0; i < this.memory.length; i++ )
        {
            if ( isNaN( this.memory[i] ) )
                return false;
        }

        return true;
    }

    clearMemory(): void
    {
        this.memory = [];
    }

    dumpMemory(): number[]
    {
        return this.memory;
    }
}