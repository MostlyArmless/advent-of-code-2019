import { OpCode } from "./IntCodeComputer";

export interface InstructionInfo
{
    numParams: number;
    storesResult: boolean;
    instructionLength: number;
    resultAddressIsParam: boolean;
}

export function GetInstructionInfo( opCode: OpCode ): InstructionInfo
{
    let instructionInfo: InstructionInfo = {
        numParams: 0,
        storesResult: false,
        instructionLength: 0,
        resultAddressIsParam: false
    };
    // Note that numParams includes both parameters that are inputs as well as the output address.
    // Therefore, the offset between the opcode and the result address param is always numParams
    switch ( opCode )
    {
        case OpCode.Add:
        case OpCode.Multiply:
            instructionInfo.numParams = 3;
            instructionInfo.storesResult = true;
            instructionInfo.resultAddressIsParam = false;
            instructionInfo.instructionLength = 4;
            break;

        case OpCode.StdIn:
            instructionInfo.numParams = 1;
            instructionInfo.storesResult = true;
            instructionInfo.resultAddressIsParam = true;
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
            instructionInfo.numParams = 3;
            instructionInfo.storesResult = true;
            instructionInfo.resultAddressIsParam = false;
            instructionInfo.instructionLength = 4;
            break;

        case OpCode.Equals:
            instructionInfo.numParams = 3;
            instructionInfo.storesResult = true;
            instructionInfo.resultAddressIsParam = false;
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