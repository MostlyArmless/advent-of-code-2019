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

export type Vector = [number, number, number];

export interface IMemory
{
    loadProgram( program: number[] | bigint[] ): void;
    reset(): void;
    load( address: bigint ): bigint;
    store( address: bigint, value: bigint ): void;
    dumpRamOnly(): bigint[];
}

export enum PaintColor
{
    BlackUnvisited = '.',
    Black = 'o',
    White = '#',
    OriginBlack = 'B',
    OriginWhite = 'W'
}