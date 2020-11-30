import * as Jimp from 'jimp';
import { Grid } from './Grid';

export enum PixelColor
{
    Red = 0xFF0000FF,
    Green = 0x00FF00FF,
    Blue = 0x0000FFFF,
    Black = 0x000000FF,
    White = 0xFFFFFFFF,
    Transparent = 0x00000000
}

export function gridToBmp( filename: string, grid: Grid<string>, colorMap: Map<string, PixelColor> ): void
{
    const { numRows, numCols } = grid.getSize();

    const jmp = new Jimp( numRows, numCols, ( err, img ) =>
    {
        if ( err ) throw err;

        const { numRows, numCols } = grid.getSize();
        for ( let iRow = 0; iRow < numRows; iRow++ )
        {
            for ( let iCol = 0; iCol < numCols; iCol++ )
            {
                const strElem = grid.get( iRow, iCol );
                const color = colorMap.has( strElem ) ? colorMap.get( strElem ) : PixelColor.Green;
                img.setPixelColor( color, iCol, iRow );
            }
        }

        img.flip( false, true );
        img.write( filename );
    } );

    console.log( jmp );
}