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
        let retVal: bigint = null;

        if ( address < 0 )
            throw new Error( "Negative address" );

        if ( address > this.ram.length && address < Number.MAX_SAFE_INTEGER )
        {
            this.ram[Number( address )] = 0n;
        }

        if ( address < Number.MAX_SAFE_INTEGER )
        {
            retVal = this.ram[Number( address )];
        }
        else
        {
            retVal = this.bigram.get( address );
        }

        if ( typeof retVal !== 'bigint' )
            throw new Error( `Somehow a non-bigint ended up in Memory, at address ${address}` );

        return retVal;
    }

    store( address: bigint, value: bigint ): void
    {
        if ( address < 0 )
        {
            throw new Error( "Can't store values at negative addresses" );
        }

        if ( typeof value !== 'bigint' )
        {
            throw new Error( "Can't story a non-bigint in Memory" );
        }

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