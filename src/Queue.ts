import { Deferred } from "./Deferred";

export class Queue<T>
{
    values: T[];
    deferredValues: Deferred<T>[];

    constructor()
    {
        this.values = [];
        this.deferredValues = [];
    }

    pushBack( value: T )
    {
        if ( this.deferredValues.length > 0 )
        {
            const firstInLine = this.deferredValues.shift();
            firstInLine.resolve( value );
        }
        else
        {
            this.values.unshift( value );
        }
    }

    async popFront(): Promise<T>
    {
        // If there are values, pop the next one immediately, otherwise set a timeout and check again later (waiting for new values to be pushed)
        if ( this.values.length > 0 )
        {
            return this.values.pop();
        }
        else
        {
            const dfd = new Deferred<T>();
            this.deferredValues.push( dfd );
            return dfd.promise;
        }
    }

    clear(): void
    {
        this.values = [];
    }
}