import { measureExecutionTime } from "./tools";

const pwMinVal = 138241;
const pwMaxVal = 674034;

export function hasPairOfMatchingDigits( s: string )
{
    for ( let i = 0; i < s.length - 1; i++ )
    {
        if ( s[i] === s[i + 1] )
        {
            return true;
        }
    }
    return false;
}

function monotonicallyIncreasingDigits( s: string )
{
    for ( let i = 1; i < s.length; i++ )
    {
        if ( s[i] < s[i - 1] )
            return false;
    }
    return true;
}

function problem4a()
{
    let validPasswords: number[] = [];

    for ( let pw = pwMinVal; pw <= pwMaxVal; pw++ )
    {
        const pwString = pw.toString();
        if ( hasPairOfMatchingDigits( pwString ) && monotonicallyIncreasingDigits( pwString ) )
        {
            validPasswords.push( pw );
        }
    }

    console.log( `Found ${validPasswords.length} valid passwords between ${pwMinVal} and ${pwMaxVal}` );
}

measureExecutionTime( problem4a );