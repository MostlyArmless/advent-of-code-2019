import { IStdIn, IStdOut } from './interfaces';
import { Queue } from './Queue';

export class IoBuffer<T> implements IStdIn<T>, IStdOut<T>
{
    queue: Queue<T>;

    constructor()
    {
        this.queue = new Queue();
    }

    async getInput(): Promise<T>
    {
        return await this.queue.popFront();
    }

    sendOutput( value: T ): void
    {
        this.queue.pushBack( value );
    }

    clear(): void
    {
        this.queue.clear();
    }
}