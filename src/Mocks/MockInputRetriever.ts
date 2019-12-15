import { IStdIn } from "../interfaces";

export class MockStdIn implements IStdIn
{
    values: number[];
    index: number;

    constructor( numbersToYield: number[] )
    {
        this.values = numbersToYield;
        this.index = 0;
    }

    setInput( numbersToYield: number[] ): void
    {
        this.values = numbersToYield;
        this.index = 0;
    }

    getInput(): number
    {
        const nextNumber = this.values[this.index];
        this.index += 1;
        return nextNumber;
    }
}