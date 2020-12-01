import * as fs from 'fs';

export function convertDecimalToBaseN( decimalNumber: number, radix: number, precision: number ): string
{
    let result = parseInt( decimalNumber.toString(), 10 ).toString( radix );

    while ( result.length < precision )
    {
        result = '0' + result;
    }

    return result;
}

export function allPermutations( arr: any[] ): any[]
{

    let ret = [];

    for ( let i = 0; i < arr.length; i = i + 1 )
    {
        let rest = allPermutations( arr.slice( 0, i ).concat( arr.slice( i + 1 ) ) );

        if ( !rest.length )
        {
            ret.push( [arr[i]] )
        } else
        {
            for ( let j = 0; j < rest.length; j = j + 1 )
            {
                ret.push( [arr[i]].concat( rest[j] ) )
            }
        }
    }
    return ret;
}

export function NumToBigInt( arr: number[] ): bigint[]
{
    let output: bigint[] = [];
    arr.forEach( elem =>
    {
        output.push( BigInt( elem ) );
    } );

    return output;
}

export function BigIntToNum( arr: bigint[] ): number[]
{
    let output: number[] = [];
    arr.forEach( elem =>
    {
        output.push( Number( elem ) );
    } );

    return output;
}

export function readFileAsBigIntArray( filename: string ): bigint[]
{
    let output: bigint[] = [];

    const fileContents = fs.readFileSync( filename ).toString();
    const elements = fileContents.split( ',' );

    elements.forEach( element =>
    {
        output.push( BigInt( element ) );
    } )

    return output;
}

export function readFileAsArrayOfLines( filename: string ): string[]
{
    const fileContents = fs.readFileSync( filename ).toString();
    const lines = fileContents.split( '\n' );
    return lines;
}