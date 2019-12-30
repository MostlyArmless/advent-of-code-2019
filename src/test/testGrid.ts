import { Grid } from "../Grid";
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
        const gridStr = grid.toString();
        const expectedString = 'x,x,x,x,x\nx,x,x,x,x\nx,x,x,x,x\n';
        expect( gridStr ).to.equal( expectedString );
    } );
} );