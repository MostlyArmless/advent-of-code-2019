import { calcCenterOfMass, Coordinate, idToCoord } from "./Coord";
import { Grid } from "./Grid";
import { IoBuffer } from "./IoBuffer";
import { CoordinateId, IComputer, LoggingLevel, PaintColor } from "./interfaces";
import { translateCoords, convertRThetaPhiToXyz } from "./CoordinateTranslator";
import * as fse from 'fs-extra';
import { Bitmap, PixelColor } from "./DrawingTools";

type Arrow = '^' | 'v' | '<' | '>';

enum Turn
{
    Left = 0,
    Right = 1
}

interface Direction
{
    dx: number;
    dy: number;
    newOrientation: Arrow;
    turnName: "left" | "right";
}

const paintColorMap = new Map<PaintColor, PixelColor>( [
    [PaintColor.Black, PixelColor.Black],
    [PaintColor.BlackUnvisited, PixelColor.Black],
    [PaintColor.White, PixelColor.White],
    [PaintColor.ArrowUp, PixelColor.Red],
    [PaintColor.ArrowLeft, PixelColor.Red],
    [PaintColor.ArrowRight, PixelColor.Red],
    [PaintColor.ArrowDown, PixelColor.Red],
    [PaintColor.OriginBlack, PixelColor.Black],
    [PaintColor.OriginWhite, PixelColor.White]
] );

const startingPosition = new Coordinate( 0, 0 );

export class PaintingRobot
{
    private camera: IoBuffer<bigint>;
    private nextActions: IoBuffer<bigint>;
    private computer: IComputer;
    private mapPanelColors: Map<CoordinateId, PaintColor[]>;
    private currentPosition: Coordinate;
    private orientation: Arrow;
    private maxRadiusReached: number;
    private thetaAtMaxRadius: number;
    private numMoveInstructionsProcessed: number;
    private numPaintInstructionsProcessed: number;
    private loggingLevel: LoggingLevel;
    private numUniquePaintJobsApplied: number;

    constructor( computer: IComputer, camera: IoBuffer<bigint>, nextActions: IoBuffer<bigint>, program: bigint[], loggingLevel: LoggingLevel = LoggingLevel.Off )
    {
        this.camera = camera;
        this.nextActions = nextActions;
        this.computer = computer;

        this.computer.reset();
        this.computer.loadProgram( program );
        this.mapPanelColors = new Map<CoordinateId, PaintColor[]>();
        this.maxRadiusReached = 0;
        this.thetaAtMaxRadius = 0;
        this.currentPosition = new Coordinate( 0, 0 );
        this.orientation = '^';
        this.numMoveInstructionsProcessed = 0;
        this.numPaintInstructionsProcessed = 0;
        this.loggingLevel = loggingLevel;
        this.numUniquePaintJobsApplied = 0; // TODO delete me

        // The origin always start out black
        this.mapPanelColors.set( this.currentPosition.getId(), [PaintColor.Black] );
    }

    async paint(): Promise<void>
    {
        this.camera.sendOutput( 0n ); // First thing we see is definitely going to be black, since the whole ship is black to start with.

        this.computer.runProgram();
        if ( this.loggingLevel >= LoggingLevel.Verbose )
            this.drawStateAsText();

        let computerStillProcessing: boolean = true;
        while ( computerStillProcessing )
        {
            const nextPaintColor = await this.ComputeNextPaintColor();
            if ( nextPaintColor !== null )
            {
                this.paintCurrentPosition( nextPaintColor ); // Paint the spot we're on before moving
                this.numPaintInstructionsProcessed++;
                if ( this.loggingLevel >= LoggingLevel.Basic )
                {
                    const colorName = nextPaintColor === PaintColor.Black ? "black" : "white";
                    console.log( `After ${this.numMoveInstructionsProcessed + this.numPaintInstructionsProcessed} total instructions (${this.numPaintInstructionsProcessed} paints and ${this.numMoveInstructionsProcessed} moves): paint ${colorName}` );
                }
            }
            else
            {
                computerStillProcessing = false;
            }

            const nextDirection = await this.ComputeNextDirection();
            if ( nextDirection !== null )
            {
                const { dx, dy, newOrientation, turnName } = nextDirection;
                this.currentPosition.move( dx, dy ); // Move to the new spot
                this.numMoveInstructionsProcessed++;
                this.orientation = newOrientation;
                const colorOfNewPosition = this.getColorAtCurrentPosition(); // Read the new color

                if ( this.currentPosition.r > this.maxRadiusReached )
                {
                    this.maxRadiusReached = this.currentPosition.r;
                    this.thetaAtMaxRadius = this.currentPosition.theta;
                }

                if ( this.loggingLevel >= LoggingLevel.Basic )
                {
                    console.log( `After ${this.numMoveInstructionsProcessed + this.numPaintInstructionsProcessed} total instructions (${this.numPaintInstructionsProcessed} paints and ${this.numMoveInstructionsProcessed} moves): turn ${turnName}` );
                }

                this.camera.sendOutput( colorOfNewPosition === PaintColor.Black ? 0n : 1n );
            }
            else
            {
                computerStillProcessing = false;
            }

            if ( this.loggingLevel >= LoggingLevel.Verbose )
                this.drawStateAsText();
        }
    }

    private getColorAtCurrentPosition()
    {
        const currentPositionId = this.currentPosition.getId();
        return this.mapPanelColors.has( currentPositionId ) ? this.mapPanelColors.get( currentPositionId ) : PaintColor.Black;
    }

    private paintCurrentPosition( paintColor: PaintColor )
    {
        if ( this.mapPanelColors.has( this.currentPosition.getId() ) )
        {
            // We've been here before
            let colorsOnThisSquareSoFar = this.mapPanelColors.get( this.currentPosition.getId() );
            const currentColorOfThisSquare = colorsOnThisSquareSoFar[colorsOnThisSquareSoFar.length - 1];

            if ( paintColor !== currentColorOfThisSquare )
            {
                this.numUniquePaintJobsApplied++;
            }

            colorsOnThisSquareSoFar.push( paintColor );
            this.mapPanelColors.set( this.currentPosition.getId(), colorsOnThisSquareSoFar );
        }
        else
        {
            // We've never been here before
            this.numUniquePaintJobsApplied++;
            this.mapPanelColors.set( this.currentPosition.getId(), [paintColor] );
        }
    }

    private parseDirection( direction: number ): Direction
    {
        let retVal: Direction = {
            dx: 0,
            dy: 0,
            newOrientation: '^',
            turnName: direction === Turn.Right ? "right" : "left"
        };

        switch ( this.orientation )
        {
            case '<':
                {
                    retVal.dx = 0;
                    retVal.dy = direction === Turn.Right ? 1 : -1;
                    retVal.newOrientation = direction === Turn.Right ? '^' : 'v';
                    break;
                }
            case '^':
                {
                    retVal.dx = direction === Turn.Right ? 1 : -1;
                    retVal.dy = 0;
                    retVal.newOrientation = direction === Turn.Right ? '>' : '<';
                    break;
                }
            case '>':
                {
                    retVal.dx = 0;
                    retVal.dy = direction === Turn.Right ? -1 : 1;
                    retVal.newOrientation = direction === Turn.Right ? 'v' : '^';
                    break;
                }
            case 'v':
                {
                    retVal.dx = direction === Turn.Right ? -1 : 1;
                    retVal.dy = 0;
                    retVal.newOrientation = direction === Turn.Right ? '<' : '>';
                    break;
                }
        }

        return retVal;
    }

    getNumPanelsPaintedAtLeastOnce(): number
    {
        return this.mapPanelColors.size
    }

    getNumUniquePaintsApplied(): number
    {
        return this.numUniquePaintJobsApplied;
    }

    async drawStateAsImage( filename: string ): Promise<void>
    {
        // Directly create the bitmap without using a grid first
        let points: Coordinate[] = [];
        this.mapPanelColors.forEach( ( colors, coordId ) =>
        {
            if ( coordId === startingPosition.getId() )
                return;

            points.push( idToCoord( coordId ) );
        } );
        const centerOfMass = calcCenterOfMass( points, true );

        // Define (0,0) to be in the middle of the grid for human readability.
        const minGridSize = 2;
        const width = Math.max( minGridSize, 2 * ( Math.ceil( this.maxRadiusReached ) + 1 ) );
        const height = width;

        const originForPlottingPurposes = new Coordinate( -( width / 2 ), -( height / 2 ) );

        function translatePointForDrawing( point: Coordinate ): Coordinate
        {
            return translateCoords( originForPlottingPurposes, translateCoords( centerOfMass, point ) );
        }

        // Convert paint colors to pixel colors
        const pixelColors: Map<Coordinate, PixelColor> = new Map<Coordinate, PixelColor>();
        this.mapPanelColors.forEach( ( colors, coordId ) =>
        {
            const pixelColor = paintColorMap.get( colors[colors.length - 1] );
            const rawCoord = idToCoord( coordId );
            const pointTranslated: Coordinate = translatePointForDrawing( rawCoord );
            if ( pointTranslated.x < 0 || pointTranslated.x > width || pointTranslated.y < 0 || pointTranslated.y > height )
                throw new Error( "PointTranslater is outside the image grid" );
            pixelColors.set( pointTranslated, pixelColor );
        } );

        if ( pixelColors.size !== this.mapPanelColors.size )
            throw new Error( `Different number of pixelColors (${pixelColors.size}) and paintColors (${this.mapPanelColors.size})` );


        pixelColors.set( translatePointForDrawing( this.currentPosition ), PixelColor.Red );

        const originColors = this.mapPanelColors.get( startingPosition.getId() );
        const originColor = originColors[originColors.length - 1] === PaintColor.White ? PixelColor.Green : PixelColor.Blue;
        pixelColors.set( translatePointForDrawing( startingPosition ), originColor );

        const bmp = new Bitmap( filename, height, width, pixelColors );
        await bmp.writeToFile();
    }

    private getGrid(): Grid<string>
    {
        const furthestPointReached = convertRThetaPhiToXyz( this.maxRadiusReached, this.thetaAtMaxRadius );
        const minGridSize = 5;
        if ( this.loggingLevel >= LoggingLevel.Verbose )
        {
            console.log( `Position = ${this.currentPosition.getId()}` );
            console.log( `Furthest point reached: rtheta = (${this.maxRadiusReached},${this.thetaAtMaxRadius}), xy = (${furthestPointReached.x},${furthestPointReached.y})` );
            console.log( `Painted ${this.getNumPanelsPaintedAtLeastOnce()} unique panels, including starting position` );
        }

        // Define (0,0) to be in the middle of the grid for human readability.
        const xGrid = Math.max( minGridSize, 2 * Math.abs( furthestPointReached.x ) + 1 );
        const yGrid = Math.max( minGridSize, 2 * Math.abs( furthestPointReached.y ) + 1 );
        const grid = new Grid<string>( Math.abs( yGrid ) * 2, Math.abs( xGrid ) * 2, PaintColor.BlackUnvisited );

        const originForPlottingPurposes = new Coordinate( -xGrid, -yGrid );
        const positionTranslated = translateCoords( originForPlottingPurposes, this.currentPosition );

        this.mapPanelColors.forEach( ( colors, coordinateId ) =>
        {
            const color: PaintColor = colors[colors.length - 1]; // Take the topmost (most recent) color
            const point: Coordinate = idToCoord( coordinateId );
            const pointTranslated: Coordinate = translateCoords( originForPlottingPurposes, point );
            grid.set( pointTranslated.y, pointTranslated.x, color );
        } );

        // Mark the origin with "B" or "W" (rather than "#" or ".") to make it visually distinct. For human readability only.
        const originColors = this.mapPanelColors.get( startingPosition.getId() );
        const mostRecentOriginColor = originColors[originColors.length - 1] === PaintColor.Black ? PaintColor.OriginBlack : PaintColor.OriginWhite;
        grid.set( yGrid, xGrid, mostRecentOriginColor );

        grid.set( positionTranslated.y, positionTranslated.x, this.orientation ); // Draw after to make sure the robot always appears on top

        return grid;
    }

    drawStateAsText( filename?: string ): void
    {
        const grid = this.getGrid();
        if ( filename )
        {
            fse.writeFileSync( filename, grid.toString( true ).replace( / /g, '' ) );
        }
        else
        {
            console.log( grid.toString( true ) );
        }
    }

    async ComputeNextPaintColor(): Promise<PaintColor | null>
    {
        try
        {
            const nextInstruction = await this.nextActions.getInput();
            switch ( nextInstruction )
            {
                case 0n:
                    return PaintColor.Black;
                case 1n:
                    return PaintColor.White;
                default:
                    throw new Error( `Computer provided invalid color: ${nextInstruction}` );
            }
        } catch ( error )
        {
            console.log( `Computer stopped providing outputs, no final color could be obtained` );
            return null;
        }
    }

    async ComputeNextDirection(): Promise<Direction | null>
    {
        try
        {
            const nextInstruction = await this.nextActions.getInput();
            return this.parseDirection( Number( nextInstruction ) );
        } catch ( error )
        {
            console.log( `Computer stopped providing outputs, no final direction could be obtained` );
            return null;
        }
    }
}