
const pwMinVal = 138241;
const pwMaxVal = 674034;

export function hasPairOfMatchingDigits( s: string ): boolean
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

export function hasPairOfMatchingDigitsNotPartOfLargerGroup( s: string ): boolean
{
    let groupSize = 1;
    let containsGroupOfExactly2 = false;

    for ( let i = 1; i < s.length; i++ )
    {
        // Check
        let charChanged = ( s[i] !== s[i - 1] );
        if ( charChanged && groupSize == 2 )
        {
            return true;
        }

        // state transition
        groupSize = charChanged ? 1 : groupSize + 1;
        if ( groupSize === 2 )
        {
            containsGroupOfExactly2 = true;
        }
        else if ( groupSize === 3 )
        {
            containsGroupOfExactly2 = false;
        }
    }

    return containsGroupOfExactly2;
}

function hasMonotonicallyIncreasingDigits( s: string ): boolean
{
    for ( let i = 1; i < s.length; i++ )
    {
        if ( s[i] < s[i - 1] )
            return false;
    }
    return true;
}

export function problem4a(): number
{
    let validPasswords: number[] = [];

    for ( let pw = pwMinVal; pw <= pwMaxVal; pw++ )
    {
        const pwString = pw.toString();
        if ( hasPairOfMatchingDigits( pwString ) && hasMonotonicallyIncreasingDigits( pwString ) )
        {
            validPasswords.push( pw );
        }
    }

    const answer = validPasswords.length;
    console.log( `Found ${answer} valid passwords between ${pwMinVal} and ${pwMaxVal}` );
    return answer;
}

export function problem4b(): number
{
    let validPasswords: number[] = [];

    for ( let pw = pwMinVal; pw <= pwMaxVal; pw++ )
    {
        const pwString = pw.toString();
        if ( hasMonotonicallyIncreasingDigits( pwString ) && hasPairOfMatchingDigitsNotPartOfLargerGroup( pwString ) )
        {
            validPasswords.push( pw );
        }
    }
    const answer = validPasswords.length;
    console.log( `Found ${answer} valid passwords between ${pwMinVal} and ${pwMaxVal}` );
    return answer;
}