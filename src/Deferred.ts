// You can return an instance of Deferred and the consumer can await deferred.promise, and then elsewhere you can call deferred.resolve() when the value is ready.
export class Deferred<T>
{
    promise: Promise<T>;
    resolve;
    reject;

    constructor()
    {
        this.promise = new Promise<T>( ( resolve, reject ) =>
        {
            this.resolve = resolve;
            this.reject = reject;
        } )
    }
}