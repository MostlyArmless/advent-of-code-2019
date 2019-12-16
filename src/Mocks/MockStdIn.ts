import { IStdIn } from "../interfaces";

export class MockStdIn<T> implements IStdIn<T>
{
    values: T[];
    index: number;

    constructor( numbersToYield: T[] )
    {
        this.values = numbersToYield;
        this.index = 0;
    }

    setInput( numbersToYield: T[] ): void
    {
        this.values = numbersToYield;
        this.index = 0;
    }

    async getInput(): Promise<T>
    {
        const nextNumber = this.values[this.index];
        this.index += 1;
        return nextNumber;
    }
}