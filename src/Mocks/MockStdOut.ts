import { IStdOut } from "../interfaces";

export class MockStdOut implements IStdOut
{
    outputs: number[];

    constructor()
    {
        this.outputs = [];
    }

    sendOutput( value: number ): void
    {
        console.log( `MOCK STDOUT: ${value}` );
        this.outputs.push( value );
    }
}