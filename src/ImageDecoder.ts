import { LayerInfo } from "./LayerInfo";
import { blankGrid } from "./Grid";

type Row = number[];
type Layer = Row[];

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
}