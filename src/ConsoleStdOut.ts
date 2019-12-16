import { IStdOut } from "./interfaces";

export class ConsoleStdOut<T> implements IStdOut<T>
{
    sendOutput( value: T ): void
    {
        console.log( `STDOUT: ${value}` );
    }
}