export interface IStdIn<T>
{
    getInput(): Promise<T>;
}

export interface IStdOut<T>
{
    sendOutput( value: T ): void;
}

export interface IComputer
{
    loadProgram( program: bigint[] ): void;
    runProgram(): Promise<bigint>;
    reset(): void;
    isRunning: boolean;
}

export enum LoggingLevel
{
    Off,
    Basic,
    Verbose
}