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

    async popFront(): Promise<number>
    {
        // If there are values, pop the next one immediately, otherwise set a timeout and check again later (waiting for new values to be pushed)
        await this.waitForValues();
        return this.values.pop()
    }

    clear(): void
    {
        this.values = [];
    }

    async waitForValues(): Promise<void>
    {
        while ( true )
        {
            if ( this.values.length > 0 )
            {
                return;
            }
            await null; // Prevents app from hanging
        }
    }
}