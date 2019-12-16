// Example syntax: measureExecutionTime( console.log, ['hi'], 50 );

export interface ExecutionTimerResult
{
    runtime: number;
    functionOutput: any;
}

export async function measureExecutionTime( func: Function, args?: any[], numIterations?: number ): Promise<ExecutionTimerResult>
{
    let functionRetVal;
    const isAsync = func.constructor.name === 'AsyncFunction';

    if ( numIterations == undefined || numIterations === 1 )
    {
        let duration;
        if ( args == undefined )
        {
            const t1 = process.hrtime();
            functionRetVal = isAsync ? await func() : func();
            duration = process.hrtime( t1 );
        }
        else
        {
            const t1 = process.hrtime();
            functionRetVal = isAsync ? await func( ...args ) : func( ...args );
            duration = process.hrtime( t1 );
        }

        console.log( `runtime of ${func.name} = ${duration[0]}.${duration[1]} s` );

        return {
            runtime: parseFloat( `${duration[0]}.${duration[1]}` ),
            functionOutput: functionRetVal
        };
    }
    else
    {
        let durations = [];
        for ( let i = 0; i < numIterations; i++ )
        {
            let duration;
            if ( args == undefined )
            {
                const t1 = process.hrtime();
                functionRetVal = isAsync ? await func() : func();
                duration = process.hrtime( t1 );
            }
            else
            {
                const t1 = process.hrtime();
                functionRetVal = isAsync ? await func( ...args ) : func( ...args );
                duration = process.hrtime( t1 );
            }
            durations[i] = parseFloat( `${duration[0]}.${duration[1]}` );
        }

        const totalDuration = durations.reduce( ( prev, curr, i ) =>
        {
            return prev + curr;
        } );

        const avgDuration = totalDuration / numIterations;

        console.log( `average runtime after ${numIterations} iterations = ${avgDuration} s` );

        return {
            runtime: avgDuration,
            functionOutput: functionRetVal
        };
    }
}

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