export interface IStdIn<T>
{
    getInput(): Promise<T>;
}

export interface IStdOut<T>
{
    sendOutput( value: T ): void;
}