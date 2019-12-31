import { Deferred } from "./Deferred";

export const queueTimeoutMilliseconds = 100;

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

            // If no value gets pushed to the Queue in the next 500ms, we'll reject the promise
            setTimeout( () =>
            {
                dfd.reject( `No value was pushed to the Queue within the ${queueTimeoutMilliseconds}ms timeout` );
            }, queueTimeoutMilliseconds );

            return dfd.promise;
        }
    }

    clear(): void
    {
        this.values = [];
    }
}