import { IStdIn } from "../interfaces";

export class MockStdIn implements IStdIn
{
    value: number;

    constructor( numberToYield: number )
    {
        this.value = numberToYield;
    }

    setInput( nextValue: number ): void
    {
        this.value = nextValue;
    }

    getInput(): number
    {
        return this.value;
    }
}