import { IStdOut } from "./interfaces";

export class ConsoleStdOut implements IStdOut
{
    sendOutput( value: number ): void
    {
        console.log( `STDOUT: ${value}` );
    }
}