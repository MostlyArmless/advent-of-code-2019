import { Grid } from "../src/Grid";
import { expect } from "chai";

describe( 'Grid', () =>
{
    let grid: Grid<string>;

    beforeEach( () =>
    {
        grid = new Grid( 3, 5, 'x' );
    } )

    it( 'Constructs properly', () =>
    {
        const { numRows, numCols } = grid.getSize();

        expect( numRows ).to.equal( 3 );
        expect( numCols ).to.equal( 5 );
    } );

    it( 'Retrieves values within range', () =>
    {
        const { numRows, numCols } = grid.getSize();

        expect( grid.get( 0, 0 ) ).to.equal( 'x' );
        expect( grid.get( 1, 1 ) ).to.equal( 'x' );
        expect( grid.get( numRows - 1, numCols - 1 ) ).to.equal( 'x' );
    } );

    it( 'Returns undefined when retrieving for out-of-range indices', () =>
    {
        const size = grid.getSize();

        expect( grid.get( size.numRows, 0 ) ).to.be.undefined;
    } );

    it( 'toString', () =>
    {
        const { numRows, numCols } = grid.getSize();

        // Fill each element with a unique value
        let i = 0;
        for ( let iRow = 0; iRow < numRows; iRow++ )
        {
            for ( let iCol = 0; iCol < numCols; iCol++ )
            {
                grid.set( iRow, iCol, i.toString() );
                i++;
            }
        }

        const gridStr = grid.toString();
        const expectedString = '0 1 2 3 4\n5 6 7 8 9\n10 11 12 13 14\n';
        expect( gridStr ).to.equal( expectedString );
    } );

    it( 'squarify wide grid', () =>
    {
        const wideGrid = new Grid( 3, 5, 'x' );
        console.log( `Before:\n${wideGrid.toString()}` );
        wideGrid.squarify();
        console.log( `After:\n${wideGrid.toString()}` );
        const { numRows, numCols } = wideGrid.getSize();

        expect( numRows ).to.equal( numCols );
        expect( wideGrid.get( numRows - 1, numCols - 1 ) ).to.equal( 'x' );
    } );

    it( 'squarify tall grid', () =>
    {
        const tallGrid = new Grid( 5, 3, 'x' );
        console.log( `Before:\n${tallGrid.toString()}` );
        tallGrid.squarify();
        console.log( `After:\n${tallGrid.toString()}` );
        const { numRows, numCols } = tallGrid.getSize();

        expect( numRows ).to.equal( numCols );
        expect( tallGrid.get( numRows - 1, numCols - 1 ) ).to.equal( 'x' );
    } );
} );