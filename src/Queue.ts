export class Queue
{
    values: number[]
    constructor()
    {
        this.values = [];
    }

    pushBack( value: number )
    {
        this.values.unshift( value );
    }

    popFront(): number
    {
        return this.values.pop()
    }

    clear(): void
    {
        this.values = [];
    }
}