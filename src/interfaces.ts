export interface IStdIn
{
    getInput(): Promise<number>;
}

export interface IStdOut
{
    sendOutput( value: number ): void;
}