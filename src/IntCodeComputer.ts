export class IntCodeComputer
{
    enableLogging: boolean = false;
    memory: number[];
    pos: number;
    shouldContinue: boolean;

    constructor( enableLogging?: boolean )
    {
        if ( enableLogging != undefined )
            this.enableLogging = enableLogging;

        this.memory = [];
        this.pos = 0;
        this.shouldContinue = true;
    }

    log( msg: string ): void
    {
        if ( this.enableLogging )
            console.log( msg );
    }

    runNextInstruction(): void
    {
        this.log( `pos = ${this.pos}` );
        this.log( `memoryBefore=${this.memory}` );
        const op = this.memory[this.pos];

        switch ( op )
        {
            case 1: // ADD
                {
                    this.Add();
                    break;
                }
            case 2: // MULTIPLY
                {
                    this.Multiply();
                    break;
                }
            case 99: // END
                {
                    this.shouldContinue = false;
                    break;
                }
            default:
                {
                    console.error( `Attempted to run invalid instruction '${op}' at position ${this.pos}` );
                    this.shouldContinue = false;
                }
        }

        this.log( `memoryAfter=${this.memory}` );

        // Increment the program counter
        this.pos += 4;
    }

    private Multiply()
    {
        const posA = this.memory[this.pos + 1];
        const posB = this.memory[this.pos + 2];
        const posResult = this.memory[this.pos + 3];
        const a = this.memory[posA];
        const b = this.memory[posB];
        const result = a * b;
        this.log( `Multiplying memory[${posA}](${a}) * memory[${posB}](${b}), storing ${result} at memory[${posResult}]` );
        this.memory[posResult] = result;
    }

    private Add()
    {
        const posA = this.memory[this.pos + 1];
        const posB = this.memory[this.pos + 2];
        const posResult = this.memory[this.pos + 3];
        const a = this.memory[posA];
        const b = this.memory[posB];
        const result = a + b;
        this.log( `Adding memory[${posA}](${a}) + memory[${posB}](${b}), storing ${result} at memory[${posResult}]` );
        this.memory[posResult] = result;
    }

    loadProgram( program: number[], arg1?: number, arg2?: number )
    {
        this.memory = Array.from( program ); // Copy the input array, don't take it by reference.
        if ( arg1 != undefined )
            this.memory[1] = arg1;

        if ( arg2 != undefined )
            this.memory[2] = arg2;

        this.pos = 0;
        this.shouldContinue = true;
    }

    runProgram(): number
    {
        while ( this.shouldContinue )
        {
            this.runNextInstruction();
        }

        this.log( `final memory state = ${this.memory}` );
        this.log( `result = ${this.memory[0]}` );
        return this.memory[0];
    }

    clearMemory()
    {
        this.memory = [];
    }

    dumpMemory(): number[]
    {
        return this.memory;
    }

    reset(): void
    {
        this.clearMemory();
        this.pos = 0;
        this.shouldContinue = true;
    }
}