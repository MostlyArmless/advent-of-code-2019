export function blankGrid( numRows: number, numCols: number ): any[][]
{
    let arr = [];
    for ( let iRow = 0; iRow < numRows; iRow++ )
    {
        arr.push( [] );
        for ( let iCol = 0; iCol < numCols; iCol++ )
        {
            arr[iRow].push( null );
        }
    }

    return arr;
}

export function copyGrid( grid: any[][] ): any[][]
{
    let newGrid = blankGrid( grid.length, grid[0].length );

    for ( let iRow = 0; iRow < grid.length; iRow++ )
    {
        for ( let iCol = 0; iCol < grid[iRow].length; iCol++ )
        {
            newGrid[iRow][iCol] = grid[iRow][iCol];
        }
    }

    return newGrid;
}