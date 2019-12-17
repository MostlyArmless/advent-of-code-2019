export class Memory
{
    private ram: bigint[]; // Use an array to store values where the address can be indexed by a normal Number
    private bigram: Map<bigint, bigint>; // Use a map to index those addresses which can only be expressed as a bigint

    constructor()
    {
        this.reset();
    }

    loadProgram( program: number[] | bigint[] ): void
    {
        for ( let i = 0; i < program.length; i++ )
        {
            this.ram.push( BigInt( program[i] ) );
        }
    }

    reset(): void
    {
        this.ram = [];
        this.bigram = new Map<bigint, bigint>();
    }

    // Returns the contents of ram, but only those which can be indexed by a number (i.e. nothing from the bigram)
    dumpRamOnly(): bigint[]
    {
        return this.ram;
    }

    load( address: bigint ): bigint
    {
        if ( address < Number.MAX_SAFE_INTEGER )
        {
            return this.ram[Number( address )];
        }

        return this.bigram.get( address );
    }

    store( address: bigint, value: bigint ): void
    {
        if ( address < Number.MAX_SAFE_INTEGER )
        {
            this.ram[Number( address )] = value;
        }
        else
        {
            this.bigram.set( address, value );
        }
    }
}