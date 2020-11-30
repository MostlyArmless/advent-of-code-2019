import { IComputer } from "../interfaces";
import { IoBuffer } from "../IoBuffer";

export class MockComputer implements IComputer
{
    isRunning: boolean;
    stdIn: IoBuffer<bigint>;
    stdOut: IoBuffer<bigint>;
    outputs: bigint[];
    receivedInputs: bigint[];
    outputsToSendAfterEachInput: number;

    constructor( stdIn: IoBuffer<bigint>, stdOut: IoBuffer<bigint>, outputsToSendAfterEachInput: number )
    {
        this.isRunning = true;
        this.stdIn = stdIn;
        this.stdOut = stdOut;
        this.outputs = [];
        this.receivedInputs = [];
        this.outputsToSendAfterEachInput = outputsToSendAfterEachInput;
    }

    loadProgram() { }
    reset() { }

    setOutputSequence( outputs: bigint[] ): void
    {
        this.outputs = outputs;
    }

    async runProgram(): Promise<bigint>
    {
        while ( this.outputs.length > 0 )
        {
            try
            {
                const input = await this.stdIn.getInput();
                this.receivedInputs.push( input );
                for ( let i = 0; i < this.outputsToSendAfterEachInput; i++ )
                {
                    if ( this.outputs.length === 0 )
                        break; // We try to send N outputs per input, but if we haven't been given enough points then just stop

                    this.stdOut.sendOutput( this.outputs.shift() );
                }
            }
            catch ( error )
            {
                console.log( `MockComputer failed to retrieve next value from stdIn.getInput(). Probably ran out of values.` );
            }
        }

        this.isRunning = false;
        return 0n;
    }
}