import { IStdIn, IStdOut } from './interfaces';
import { Queue } from './Queue';

export class IoBuffer implements IStdIn, IStdOut
{
    queue: Queue;

    constructor()
    {
        this.queue = new Queue();
    }

    getInput(): number
    {
        return this.queue.popFront();
    }

    sendOutput( value: number ): void
    {
        this.queue.pushBack( value );
    }

    clear(): void
    {
        this.queue.clear();
    }
}