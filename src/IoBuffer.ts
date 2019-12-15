import { IStdIn, IStdOut } from './interfaces';
import { Queue } from './Queue';

export class IoBuffer implements IStdIn, IStdOut
{
    queue: Queue;

    constructor()
    {
        this.queue = new Queue();
    }

    async getInput(): Promise<number>
    {
        return await this.queue.popFront();
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