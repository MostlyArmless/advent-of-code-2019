export function blankGrid( numRows: number, numCols: number ): any[][]
{
    return Array( numRows ).fill( Array( numCols ).fill( null ) );
}