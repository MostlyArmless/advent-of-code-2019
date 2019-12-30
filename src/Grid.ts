export class Grid<T>
{
    private numRows: number;
    private numCols: number;
    private grid: T[][];

    constructor( numRows: number, numCols: number, fillWith?: T )
    {
        if ( numRows === 0 || numCols === 0 )
            throw new Error( "Can't make a size-zero grid" );

        this.numRows = numRows;
        this.numCols = numCols;

        fillWith = fillWith === undefined ? null : fillWith;
        this.fillGrid( fillWith );
    }

    set( iRow: number, iCol: number, value: T ): void
    {
        this.grid[iRow][iCol] = value;
    }

    get( iRow: number, iCol: number ): T
    {
        const row = this.grid[iRow];
        if ( row === undefined )
            return undefined;

        return row[iCol];
    }

    getSize(): { numRows: number, numCols: number }
    {
        return {
            numRows: this.grid.length,
            numCols: this.grid[0].length
        };
    }

    fillGrid( value: T )
    {
        this.grid = Array( this.numRows );

        for ( let iRow = 0; iRow < this.numRows; iRow++ )
        {
            this.grid[iRow] = [];

            for ( let iCol = 0; iCol < this.numCols; iCol++ )
            {
                this.grid[iRow].push( value );
            }
        }
    }

    toString( shouldInvert?: boolean ): string
    {
        let str = '';
        if ( shouldInvert )
        {
            for ( let iRow = this.numRows - 1; iRow >= 0; iRow-- )
            {
                str += this.grid[iRow].toString() + '\n';
            }
        }
        else
        {
            for ( let iRow = 0; iRow < this.numRows; iRow++ )
            {
                str += this.grid[iRow].toString() + '\n';
            }
        }


        return str.replace( /,/g, ' ' );;
    }
}

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