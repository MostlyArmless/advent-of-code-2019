// Example syntax: measureExecutionTime( console.log, ['hi'], 50 );
export function measureExecutionTime( func: Function, args?: any[], numIterations?: number ): number
{
    if ( numIterations == undefined || numIterations === 1 )
    {
        let duration;
        if ( args == undefined )
        {
            const t1 = process.hrtime();
            func();
            duration = process.hrtime( t1 );
        }
        else
        {
            const t1 = process.hrtime();
            func( ...args );
            duration = process.hrtime( t1 );
        }

        console.log( `runtime = ${duration[0]}.${duration[1]} s` );

        return parseFloat( `${duration[0]}.${duration[1]}` );
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
                func();
                duration = process.hrtime( t1 );
            }
            else
            {
                const t1 = process.hrtime();
                func( ...args );
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

        return avgDuration;
    }
}