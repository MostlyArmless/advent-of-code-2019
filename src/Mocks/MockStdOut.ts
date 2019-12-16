import { IStdOut } from "../interfaces";

export class MockStdOut<T> implements IStdOut<T>
{
    outputs: T[];

    constructor()
    {
        this.outputs = [];
    }

    sendOutput( value: T ): void
    {
        console.log( `MOCK STDOUT: ${value}` );
        this.outputs.push( value );
    }
}