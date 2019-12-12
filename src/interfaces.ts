export interface IStdIn
{
    getInput(): number;
}

export interface IStdOut
{
    sendOutput( value: number ): void;
}