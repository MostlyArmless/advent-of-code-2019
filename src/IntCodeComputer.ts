import * as readline from 'readline-sync';

enum ParamMode
{
    Position,
    Immediate
}

enum OpCode
{
    Add = 1,
    Multiply = 2,
    StdIn = 3,
    StdOut = 4,
    End = 99
}

interface Instruction
{
    opCode: OpCode;
    paramModes: ParamMode[];
    resultAddress: number;
    distanceToNextInstruction: number; // Amount you need to increment the program counter by to reach the next instruction
}

interface InstructionInfo
{
    numParams: number;
    storesResult: boolean;
    resultOffset: number | null;
    instructionLength: number;
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

    constructor( enableLogging?: boolean )
    {
        if ( enableLogging != undefined )
            this.enableLogging = enableLogging;

        this.reset();
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

        switch ( instruction.opCode )
        {
            case 1:
                {
                    this.Add( params[0], params[1], instruction.resultAddress );
                    break;
                }
            case 2:
                {
                    this.Multiply( params[0], params[1], instruction.resultAddress );
                    break;
                }
            case 3:
                {
                    this.StdIn( instruction.resultAddress );
                    break;
                }
            case 4:
                {
                    this.StdOut( params[0] );
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
        // this.log( `Incrementing program counter by ${instruction.distanceToNextInstruction}` );
        this.pos += instruction.distanceToNextInstruction;
        this.numInstructionsProcessed += 1;
        // this.log( `Completed ${this.numInstructionsProcessed} instructions.` );
        this.log( "" ); // To visually separate different instructions
    }

    private GetInstructionInfo( opCode: OpCode ): InstructionInfo
    {
        let instructionInfo = {
            numParams: 0,
            storesResult: false,
            resultOffset: null,
            instructionLength: 0
        };

        switch ( opCode )
        {
            case OpCode.Add:
            case OpCode.Multiply:
                instructionInfo.numParams = 2;
                instructionInfo.storesResult = true;
                instructionInfo.resultOffset = instructionInfo.numParams + 1;
                instructionInfo.instructionLength = 4;
                break;
            case OpCode.StdIn:
                instructionInfo.numParams = 1;
                instructionInfo.storesResult = true;
                instructionInfo.resultOffset = instructionInfo.numParams;
                instructionInfo.instructionLength = 2;
                break;
            case OpCode.StdOut:
                instructionInfo.numParams = 1;
                instructionInfo.storesResult = false;
                instructionInfo.instructionLength = 2;
                break;
            case OpCode.End:
                instructionInfo.numParams = 0;
                instructionInfo.storesResult = false;
                instructionInfo.instructionLength = 1;
                break;
        }

        return instructionInfo;
    }

    private ParseInstruction(): Instruction
    {
        const opString = this.memory[this.pos].toString();
        const opCode = parseInt( opString.slice( -2 ) ) as OpCode;
        let paramModes = opString.slice( 0, -2 ).split( '' ).reverse().map( char => parseInt( char ) );

        const instructionInfo = this.GetInstructionInfo( opCode );

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

    private StdIn( resultAddress ): void
    {
        const input = parseInt( readline.question( 'Enter a number: ' ) );
        this.log( `Storing value ${input} at address ${resultAddress}` );
        this.memory[resultAddress] = input;
    }

    private StdOut( valueToPrint ): void
    {
        console.log( `STDOUT: '${valueToPrint}'` );
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
        }

        this.log( `Finished running after ${this.numInstructionsProcessed} steps.` );
        this.log( `Final memory state = ${this.memory}` );
        this.log( `Result = ${this.memory[0]}` );
        return this.memory[0];
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