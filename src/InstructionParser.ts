import { IInstruction, OpCode, ParamMode } from "./IntCodeComputer";
import { Memory } from "./Memory";
import { GetInstructionInfo } from "./InstructionInfoRetriever";

export class InstructionParser
{
    memory: Memory;
    enableLogging: boolean;

    constructor( memory: Memory, enableLogging: boolean )
    {
        this.memory = memory;
        this.enableLogging = enableLogging;
    }

    parse( instructionPointer: bigint, relativeBase: bigint ): IInstruction
    {
        const opString = this.memory.load( instructionPointer ).toString();
        const opCode = parseInt( opString.slice( -2 ) ) as OpCode;
        let paramModes = opString.slice( 0, -2 ).split( '' ).reverse().map( char => parseInt( char ) );

        const instructionInfo = GetInstructionInfo( opCode );

        while ( paramModes.length < instructionInfo.numParams )
        {
            paramModes.push( ParamMode.Position );
        }

        const params = this.GetParams( instructionPointer, relativeBase, paramModes );
        this.log( `INSTRUCTION = ${opCode}, Parameter modes = ${paramModes}, param values = ${params}` );

        this.validateParams( params );
        const resultAddress = instructionInfo.storesResult ? this.getResultAddress( instructionPointer, BigInt( instructionInfo.numParams ), paramModes, relativeBase ) : null;

        return {
            opCode: opCode,
            paramModes: paramModes,
            resultAddress: resultAddress,
            distanceToNextInstruction: instructionInfo.instructionLength,
            params: params
        };
    }

    private getResultAddress( instructionPointer: bigint, resultOffset: bigint, paramModes: number[], relativeBase: bigint ): bigint
    {
        if ( resultOffset === null )
            return null;

        const resultAddressRawValue = this.memory.load( instructionPointer + resultOffset );
        const resultParamMode = paramModes.slice( -1 )[0];
        switch ( resultParamMode )
        {
            case ParamMode.Position:
                return resultAddressRawValue;

            case ParamMode.Relative:
                return relativeBase + resultAddressRawValue;

            case ParamMode.Immediate:
                throw new Error( "Result address will never be an immediate value!" );
        }
    }

    private GetParams( instructionPointer: bigint, relativeBase: bigint, paramModes: ParamMode[] ): bigint[]
    {
        let params = Array( paramModes.length );

        for ( let i = 0; i < paramModes.length; i++ )
        {
            switch ( paramModes[i] )
            {
                case ParamMode.Position:
                    {
                        const address = this.memory.load( instructionPointer + BigInt( i ) + 1n );
                        params[i] = this.memory.load( address );
                        break;
                    }
                case ParamMode.Immediate:
                    {
                        params[i] = this.memory.load( instructionPointer + BigInt( i ) + 1n );
                        break;
                    }
                case ParamMode.Relative:
                    {
                        const offset = this.memory.load( instructionPointer + BigInt( i ) + 1n );
                        params[i] = this.memory.load( relativeBase + offset );
                        break;
                    }
                default:
                    {
                        throw new Error( "Unhandled ParamMode!" );
                    }
            }
        }

        return params;
    }

    private validateParams( params: bigint[] )
    {
        if ( !this.enableLogging )
            return;

        for ( const param of params )
        {
            if ( param === undefined )
                throw new Error( 'undefined param' );
            else if ( typeof param !== 'bigint' )
                throw new Error( 'param should be of type bigint' );
        }
    }

    log( msg: string )
    {
        if ( this.enableLogging )
            console.log( msg );
    }
}