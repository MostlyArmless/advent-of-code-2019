import { blankGrid, copyGrid } from "../Grid";

// Test framework dependencies
const expect = require( 'chai' ).expect;

describe( 'Tools', () =>
{
    it( 'blankGrid()', () =>
    {
        const numCols = 10;
        const numRows = 7;
        const grid = blankGrid( numRows, numCols );
        expect( grid.length ).to.equal( numRows );
        for ( let iRow = 0; iRow < grid.length; iRow++ )
        {
            console.log( `Checking numCols in row ${iRow}...` );
            expect( grid[iRow].length ).to.equal( numCols );
        }
    } );

    it( 'copyGrid()', () =>
    {
        const grid = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ];

        const gridCopy = copyGrid( grid );

        expect( gridCopy.length ).to.equal( grid.length );
        let i = 1;
        for ( let iRow = 0; iRow < grid.length; iRow++ )
        {
            for ( let iCol = 0; iCol < grid[iRow].length; iCol++ )
            {
                expect( gridCopy[iRow][iCol] ).to.equal( i );
                i++;
            }
        }
    } );
} );

