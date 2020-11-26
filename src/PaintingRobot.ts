import { Coordinate } from "./Coord";
import { Grid } from "./Grid";
import { IoBuffer } from "./IoBuffer";
import { IComputer, LoggingLevel } from "./interfaces";
import { translateCoords, convertRThetaPhiToXyz } from "./CoordinateTranslator";
import * as fse from 'fs-extra';

type CoordinateId = string;
type Arrow = '^' | '<' | '>' | 'v';
enum Color
{
    BlackUnvisited = '.',
    Black = 'o',
    White = '#'
}

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

const startingPosition = new Coordinate( 0, 0 );

export class PaintingRobot
{
    private camera: IoBuffer<bigint>;
    private nextActions: IoBuffer<bigint>;
    private computer: IComputer;
    private paintedPanels: Map<CoordinateId, Color[]>;
    private position: Coordinate;
    private orientation: Arrow;
    private maxRadiusReached: number;
    private thetaAtMaxRadius: number;
    private numMoveInstructionsProcessed: number;
    private numPaintInstructionsProcessed: number;
    private loggingLevel: LoggingLevel;
    private numUniquePaintJobsApplied: number;

    constructor( computer: IComputer, camera: IoBuffer<bigint>, nextActions: IoBuffer<bigint>, program: bigint[], loggingLevel?: LoggingLevel )
    {
        this.camera = camera;
        this.nextActions = nextActions;
        this.computer = computer;

        this.computer.reset();
        this.computer.loadProgram( program );
        this.paintedPanels = new Map<CoordinateId, Color[]>();
        this.maxRadiusReached = 0;
        this.thetaAtMaxRadius = 0;
        this.position = new Coordinate( 0, 0 );
        this.orientation = '^';
        this.numMoveInstructionsProcessed = 0;
        this.numPaintInstructionsProcessed = 0;
        this.loggingLevel = loggingLevel;
        this.numUniquePaintJobsApplied = 0; // TODO delete me

        // The origin always start out black
        this.paintedPanels.set( this.position.getId(), [Color.Black] );
    }

    async paint(): Promise<void>
    {
        this.camera.sendOutput( 0n ); // First thing we see is definitely going to be black, since the whole ship is black to start with.

        this.computer.runProgram();
        if ( this.loggingLevel >= LoggingLevel.Verbose )
            this.drawState();

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
                    const colorName = nextPaintColor === Color.Black ? "black" : "white";
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
                this.position.move( dx, dy ); // Move to the new spot
                this.numMoveInstructionsProcessed++;
                this.orientation = newOrientation;
                const colorOfNewPosition = this.getColorAtCurrentPosition(); // Read the new color

                if ( this.position.r > this.maxRadiusReached )
                {
                    this.maxRadiusReached = this.position.r;
                    this.thetaAtMaxRadius = this.position.theta;
                }

                if ( this.loggingLevel >= LoggingLevel.Basic )
                {
                    console.log( `After ${this.numMoveInstructionsProcessed + this.numPaintInstructionsProcessed} total instructions (${this.numPaintInstructionsProcessed} paints and ${this.numMoveInstructionsProcessed} moves): turn ${turnName}` );
                }

                this.camera.sendOutput( colorOfNewPosition === Color.Black ? 0n : 1n );
            }
            else
            {
                computerStillProcessing = false;
            }

            if ( this.loggingLevel >= LoggingLevel.Verbose )
                this.drawState();
        }
    }

    private getColorAtCurrentPosition()
    {
        const currentPositionId = this.position.getId();
        return this.paintedPanels.has( currentPositionId ) ? this.paintedPanels.get( currentPositionId ) : Color.Black;
    }

    private paintCurrentPosition( paintColor: Color )
    {
        if ( this.paintedPanels.has( this.position.getId() ) )
        {
            // We've been here before
            let colorsOnThisSquareSoFar = this.paintedPanels.get( this.position.getId() );
            const currentColorOfThisSquare = colorsOnThisSquareSoFar[colorsOnThisSquareSoFar.length - 1];

            if ( paintColor !== currentColorOfThisSquare )
            {
                this.numUniquePaintJobsApplied++;
            }

            colorsOnThisSquareSoFar.push( paintColor );
            this.paintedPanels.set( this.position.getId(), colorsOnThisSquareSoFar );
        }
        else
        {
            // We've never been here before
            this.numUniquePaintJobsApplied++;
            this.paintedPanels.set( this.position.getId(), [paintColor] );
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
        return this.paintedPanels.size
    }

    getNumUniquePaintsApplied(): number
    {
        return this.numUniquePaintJobsApplied;
    }

    drawState( filename?: string ): void
    {
        const furthestPointReached = convertRThetaPhiToXyz( this.maxRadiusReached, this.thetaAtMaxRadius );
        const minGridSize = 5;
        if ( this.loggingLevel >= LoggingLevel.Verbose )
        {
            console.log( `Position = ${this.position.getId()}` );
            console.log( `Furthest point reached: rtheta = (${this.maxRadiusReached},${this.thetaAtMaxRadius}), xy = (${furthestPointReached.x},${furthestPointReached.y})` );
            console.log( `Painted ${this.getNumPanelsPaintedAtLeastOnce()} unique panels, including starting position` );
        }

        // Define (0,0) to be in the middle of the grid for human readability.
        const xGrid = Math.max( minGridSize, 2 * Math.abs( furthestPointReached.x ) + 1 );
        const yGrid = Math.max( minGridSize, 2 * Math.abs( furthestPointReached.y ) + 1 );
        const grid = new Grid<string>( Math.abs( yGrid ) * 2, Math.abs( xGrid ) * 2, Color.BlackUnvisited );

        const originForPlottingPurposes = new Coordinate( -xGrid, -yGrid );
        const positionTranslated = translateCoords( originForPlottingPurposes, this.position );

        this.paintedPanels.forEach( ( colors, coordinateId ) =>
        {
            const xy = coordinateId.split( ',' );
            const x = parseInt( xy[0] );
            const y = parseInt( xy[1] );
            const color = colors[colors.length - 1]; // Take the topmost (most recent) color
            const point = new Coordinate( x, y );
            const pointTranslated = translateCoords( originForPlottingPurposes, point );
            grid.set( pointTranslated.y, pointTranslated.x, color );
        } );

        // Mark the origin with "B" or "W" (rather than "#" or ".") to make it visually distinct. For human readability only.
        const originColors = this.paintedPanels.get( startingPosition.getId() );
        const mostRecentOriginColor = originColors[originColors.length - 1] === Color.Black ? 'B' : 'W';
        grid.set( yGrid, xGrid, mostRecentOriginColor );

        grid.set( positionTranslated.y, positionTranslated.x, this.orientation ); // Draw after to make sure the robot always appears on top

        if ( filename )
        {
            fse.writeFileSync( filename, grid.toString( true ).replace( / /g, '' ) );
        }
        else
        {
            console.log( grid.toString( true ) );
        }
    }

    async ComputeNextPaintColor(): Promise<Color | null>
    {
        try
        {
            const nextInstruction = await this.nextActions.getInput();
            switch ( nextInstruction )
            {
                case 0n:
                    return Color.Black;
                case 1n:
                    return Color.White;
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
            console.log( `Computer stopped providing outputs, no final color could be obtained` );
            return null;
        }
    }
}