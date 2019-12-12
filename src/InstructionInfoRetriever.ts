import { OpCode } from "./IntCodeComputer";

export interface InstructionInfo
{
    numParams: number;
    storesResult: boolean;
    resultOffset: number | null;
    instructionLength: number;
}

export function GetInstructionInfo( opCode: OpCode ): InstructionInfo
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
            instructionInfo.resultOffset = instructionInfo.numParams + 1;
            instructionInfo.instructionLength = 4;
            break;

        case OpCode.Equals:
            instructionInfo.numParams = 2;
            instructionInfo.storesResult = true;
            instructionInfo.resultOffset = instructionInfo.numParams + 1;
            instructionInfo.instructionLength = 4;
            break;

        case OpCode.End:
            instructionInfo.numParams = 0;
            instructionInfo.storesResult = false;
            instructionInfo.instructionLength = 1;
            break;

    }

    return instructionInfo;
}