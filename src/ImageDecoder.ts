import { LayerInfo } from "./LayerInfo";
import { blankGrid, copyGrid } from "./Grid";
import * as fs from 'fs';

type Row = number[];
type Layer = Row[];

enum Pixel
{
    Black = 0,
    White = 1,
    Transparent = 2
}

export class ImageDecoder
{
    layers: Layer[];
    layerInfo: LayerInfo[];
    encodedData: string;
    numRows: number;
    numCols: number;
    numLayers: number;

    constructor( imageWidth: number, imageHeight: number, encodedData: string )
    {
        this.numLayers = ( encodedData.length / ( imageWidth * imageHeight ) );
        this.numRows = imageHeight;
        this.numCols = imageWidth;

        this.initializeLayers( this.numLayers, imageWidth, imageHeight );
        this.initializeLayerInfo( this.numLayers );

        this.encodedData = encodedData;
        this.decodeImage();
    }

    private initializeLayerInfo( numLayers: number )
    {
        this.layerInfo = Array( numLayers ).fill( null );
        for ( let i = 0; i < this.layerInfo.length; i++ )
        {
            this.layerInfo[i] = new LayerInfo();
        }
    }

    private initializeLayers( numLayers: number, imageWidth: number, imageHeight: number )
    {
        this.layers = Array( numLayers ).fill( null );

        for ( let i = 0; i < this.layers.length; i++ )
        {
            this.layers[i] = blankGrid( imageHeight, imageWidth );
        }
    }

    private decodeImage(): void
    {
        // let [iLayer, iRow, iCol] = [0, 0, 0];
        // let iLastCol = this.numCols - 1;
        // let iLastRow = this.numRows - 1;
        let iDigit = 0;

        for ( let iLayer = 0; iLayer < this.numLayers; iLayer++ )
        {
            for ( let iRow = 0; iRow < this.numRows; iRow++ )
            {
                for ( let iCol = 0; iCol < this.numCols; iCol++ )
                {
                    const digit = parseInt( this.encodedData[iDigit] );
                    this.layers[iLayer][iRow][iCol] = digit;

                    this.updateLayerInfo( digit, iLayer );
                    iDigit++;
                }
            }
        }
    }

    private updateLayerInfo( digit: number, iLayer: number )
    {
        switch ( digit )
        {
            case 0:
                {
                    this.layerInfo[iLayer].zeros++;
                    break;
                }
            case 1:
                {
                    this.layerInfo[iLayer].ones++;
                    break;
                }
            case 2:
                {
                    this.layerInfo[iLayer].twos++;
                    break;
                }
        }
    }

    getChecksum(): number
    {
        let layerWithFewestZeros: number = null;
        let fewestZeros = Number.MAX_SAFE_INTEGER;

        for ( let iLayer = 0; iLayer < this.layerInfo.length; iLayer++ )
        {
            const info = this.layerInfo[iLayer];

            const zerosOnThisLayer = info.zeros;
            if ( zerosOnThisLayer < fewestZeros )
            {
                layerWithFewestZeros = iLayer;
                fewestZeros = zerosOnThisLayer;
            }
        }

        return this.layerInfo[layerWithFewestZeros].ones * this.layerInfo[layerWithFewestZeros].twos;
    }

    private compileLayers(): number[][]
    {
        const iTopLayer = 0;
        let canvas = copyGrid( this.layers[iTopLayer] );

        for ( let iRow = 0; iRow < this.numRows; iRow++ )
        {
            for ( let iCol = 0; iCol < this.numCols; iCol++ )
            {
                if ( canvas[iRow][iCol] !== Pixel.Transparent )
                    continue;

                // This pixel is transparent, so go down through the layers till you find a non-transparent pixel to use instead
                for ( let iLayer = iTopLayer; iLayer < this.numLayers; iLayer++ )
                {
                    if ( this.layers[iLayer][iRow][iCol] !== Pixel.Transparent )
                    {
                        canvas[iRow][iCol] = this.layers[iLayer][iRow][iCol];
                        break;
                    }
                }
            }
        }

        return canvas;
    }

    saveImageToFile(): void
    {
        const canvas = this.compileLayers();

        const str = this.layerToString( canvas );

        fs.writeFileSync( './problem8b.txt', str );
    }

    private layerToString( canvas: number[][] ): string
    {
        let str: string = '';
        canvas.forEach( row =>
        {
            str += row.toString().replace( /0/g, 'X' ).replace( /1/g, '_' ) + '\n';
        } );
        return str;
    }

    printLayer( iLayer: number ): void
    {
        const str = this.layerToString( this.layers[iLayer] );
        fs.writeFileSync( `./layer${iLayer}.txt`, str );
    }
}