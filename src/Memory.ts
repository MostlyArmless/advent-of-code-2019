import { IMemory } from "./interfaces";

export class Memory implements IMemory
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
            if ( retVal === undefined )
            {
                this.ram[Number( address )] = 0n;
                return 0n;
            }
        }
        else
        {
            retVal = this.bigram.get( address );
            if ( retVal === undefined )
            {
                this.bigram.set( address, 0n );
                return 0n;
            }
        }

        if ( typeof retVal !== 'bigint' )
            throw new Error( `Somehow a non-bigint ended up in Memory, at address ${address}` );

        return retVal;
    }

    store( address: bigint, value: bigint ): void
    {
        if ( address < 0n )
        {
            throw new Error( "Can't store values at negative addresses" );
        }

        if ( typeof value !== 'bigint' )
        {
            throw new Error( "Can't story a non-bigint in Memory" );
        }

        if ( address < Number.MAX_SAFE_INTEGER )
        {
            this.ram[Number( address )] = BigInt( value );
        }
        else
        {
            this.bigram.set( address, value );
        }
    }
}

export class MapMemory implements IMemory
{
    private ram: Map<bigint, bigint>;

    constructor()
    {
        this.reset();
    }

    reset(): void
    {
        this.ram = new Map<bigint, bigint>();
    }

    loadProgram( program: number[] | bigint[] ): void
    {
        for ( let i = 0; i < program.length; i++ )
        {
            this.ram.set( BigInt( i ), BigInt( program[i] ) );
        }
    }

    dumpRamOnly(): bigint[]
    {
        return Array.from( this.ram.values() ); // TODO not sure if this will always work. Write tests around this
    }

    load( address: bigint ): bigint
    {
        if ( !this.ram.has( address ) )
        {
            throw new Error( `Nonexistent address: '${address}'` );
        }

        return this.ram.get( address );
    }

    store( address: bigint, value: bigint ): void
    {
        this.ram.set( address, value );
    }
}