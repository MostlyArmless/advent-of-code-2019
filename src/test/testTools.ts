import { blankGrid } from "../Grid";

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
} );

