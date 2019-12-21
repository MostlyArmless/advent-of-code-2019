import { OpCode } from "./IntCodeComputer";

export interface InstructionInfo
{
    numParams: number;
    storesResult: boolean;
    resultOffset: bigint | null;
    instructionLength: number;
    resultAddressIsParam: boolean;
}

export function GetInstructionInfo( opCode: OpCode ): InstructionInfo
{
    let instructionInfo: InstructionInfo = {
        numParams: 0,
        storesResult: false,
        resultOffset: null,
        instructionLength: 0,
        resultAddressIsParam: false
    };

    switch ( opCode )
    {
        case OpCode.Add:
        case OpCode.Multiply:
            instructionInfo.numParams = 2;
            instructionInfo.storesResult = true;
            instructionInfo.resultAddressIsParam = false;
            instructionInfo.resultOffset = BigInt( instructionInfo.numParams + 1 );
            instructionInfo.instructionLength = 4;
            break;

        case OpCode.StdIn:
            instructionInfo.numParams = 1;
            instructionInfo.storesResult = true;
            instructionInfo.resultAddressIsParam = true;
            instructionInfo.resultOffset = BigInt( instructionInfo.numParams );
            instructionInfo.instructionLength = 2;
            break;

        case OpCode.StdOut:
            instructionInfo.numParams = 1;
            instructionInfo.storesResult = false;
            instructionInfo.instructionLength = 2;
            break;

        case OpCode.JumpIfFalse:
            instructionInfo.numParams = 2;
            instructionInfo.storesResult = false;
            instructionInfo.instructionLength = 3;
            break;

        case OpCode.JumpIfTrue:
            instructionInfo.numParams = 2;
            instructionInfo.storesResult = false;
            instructionInfo.instructionLength = 3;
            break;

        case OpCode.LessThan:
            instructionInfo.numParams = 2;
            instructionInfo.storesResult = true;
            instructionInfo.resultAddressIsParam = false;
            instructionInfo.resultOffset = BigInt( instructionInfo.numParams + 1 );
            instructionInfo.instructionLength = 4;
            break;

        case OpCode.Equals:
            instructionInfo.numParams = 2;
            instructionInfo.storesResult = true;
            instructionInfo.resultAddressIsParam = false;
            instructionInfo.resultOffset = BigInt( instructionInfo.numParams + 1 );
            instructionInfo.instructionLength = 4;
            break;

        case OpCode.RelativeBaseOffset:
            instructionInfo.numParams = 1;
            instructionInfo.storesResult = false;
            instructionInfo.instructionLength = 2;
            break;

        case OpCode.End:
            instructionInfo.numParams = 0;
            instructionInfo.storesResult = false;
            instructionInfo.instructionLength = 1;
            break;

        default:
            throw new Error( "Undefined opcode!" );
    }

    return instructionInfo;
}