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