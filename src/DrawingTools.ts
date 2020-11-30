import * as Jimp from 'jimp';
import { Coordinate } from './Coord';
import * as util from 'util';

export enum PixelColor
{
    Red = 0xFF0000FF,
    Green = 0x00FF00FF,
    Blue = 0x0000FFFF,
    Black = 0x000000FF,
    White = 0xFFFFFFFF,
    Transparent = 0x00000000
}

const createJimp = ( width: number, height: number ) => new Promise<Jimp>( ( resolve, reject ) =>
{
    try
    {
        new Jimp( width, height, ( error, image ) =>
        {
            if ( error )
                reject( error );

            resolve( image );
        } );
    } catch ( error )
    {
        reject( error );
    }
} );

export class Bitmap
{
    private filename: string;
    private height: number;
    private width: number;
    private pixelColors: Map<Coordinate, PixelColor>;

    constructor( filename: string, height: number, width: number, pixelColors: Map<Coordinate, PixelColor> )
    {
        this.filename = filename;
        this.height = height;
        this.width = width;
        this.pixelColors = pixelColors;
    }

    async writeToFile(): Promise<void>
    {
        const img: Jimp = await createJimp( this.height, this.width );
        const setPixelColor = util.promisify( img.setPixelColor );

        this.pixelColors.forEach( async ( color, point ) =>
        {
            await setPixelColor.call( img, color, point.x, point.y );
        } );

        const flipImage = util.promisify( img.flip );
        await flipImage.call( img, false, true );
        console.log( `Writing bitmap to file: '${this.filename}'` );
        await img.writeAsync( this.filename );
        console.log( `Done writing bitmap to file.` );
    }
}