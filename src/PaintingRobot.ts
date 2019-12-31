import { Coordinate } from "./Coord";
import { Grid } from "./Grid";
import { IoBuffer } from "./IoBuffer";
import { IComputer, LoggingLevel } from "./interfaces";
import { translateCoords, convertRThetaToXy } from "./CoordinateTranslator";
import * as fse from 'fs-extra';

type CoordinateId = string;
type Arrow = '^' | '<' | '>' | 'v';
enum Color
{
    Black = '.',
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
}

export class PaintingRobot
{
    private camera: IoBuffer<bigint>;
    private nextActions: IoBuffer<bigint>;
    private computer: IComputer;
    private visitsPerPanel: Map<CoordinateId, Color[]>;
    private position: Coordinate;
    private orientation: Arrow;
    private maxRadiusReached: number;
    private thetaAtMaxRadius: number;
    private numMovesProcessed: number;
    private loggingLevel: LoggingLevel;
    private numUniquePaintJobsApplied: number;

    constructor( computer: IComputer, camera: IoBuffer<bigint>, nextActions: IoBuffer<bigint>, program: bigint[], loggingLevel?: LoggingLevel )
    {
        this.camera = camera;
        this.nextActions = nextActions;
        this.computer = computer;

        this.computer.loadProgram( program );
        this.visitsPerPanel = new Map<CoordinateId, Color[]>();
        this.maxRadiusReached = 5;
        this.thetaAtMaxRadius = 0;
        this.position = new Coordinate( 0, 0 );
        this.orientation = '^';
        this.numMovesProcessed = 0;
        this.loggingLevel = loggingLevel;
        this.numUniquePaintJobsApplied = 0;
    }

    async paint(): Promise<void>
    {
        this.camera.sendOutput( 0n ); // First thing we see is definitely going to be black, since the whole ship is black to start with.

        this.computer.runProgram();
        if ( this.loggingLevel >= LoggingLevel.Verbose )
            this.drawState();

        while ( true )
        {
            let nextComputerOuput = null;
            try
            {
                nextComputerOuput = await this.nextActions.getInput()
            } catch ( error )
            {
                // We waited for the computer to give us an output but it never did (after some specified timeout), probably because it stopped running.
                break;
            }
            const paintColorIndex = Number( nextComputerOuput );
            const paintColor = paintColorIndex === 0 ? Color.Black : Color.White;
            const direction = Number( await this.nextActions.getInput() );

            const { dx, dy, newOrientation } = this.parseDirection( direction );
            this.paintCurrentPosition( paintColor );
            this.position.move( dx, dy );
            this.orientation = newOrientation;
            const colorOfNewPosition = this.getColorAtCurrentPosition();

            if ( this.position.r > this.maxRadiusReached )
            {
                this.maxRadiusReached = this.position.r;
                this.thetaAtMaxRadius = this.position.theta;
            }

            this.numMovesProcessed++;
            if ( this.loggingLevel === LoggingLevel.Basic )
            {
                console.log( `Processed ${this.numMovesProcessed} moves` );
            }

            if ( this.loggingLevel >= LoggingLevel.Verbose )
                this.drawState();

            this.camera.sendOutput( colorOfNewPosition === Color.Black ? 0n : 1n );
        }
    }

    private getColorAtCurrentPosition()
    {
        const currentPositionId = this.position.getId();
        return this.visitsPerPanel.has( currentPositionId ) ? this.visitsPerPanel.get( currentPositionId ) : Color.Black;
    }

    private paintCurrentPosition( paintColor: Color )
    {
        if ( this.visitsPerPanel.has( this.position.getId() ) )
        {
            // We've been here before
            let colorsOnThisSquareSoFar = this.visitsPerPanel.get( this.position.getId() );
            const currentColorOfThisSquare = colorsOnThisSquareSoFar[colorsOnThisSquareSoFar.length - 1];

            if ( paintColor !== currentColorOfThisSquare )
            {
                this.numUniquePaintJobsApplied++;
            }

            colorsOnThisSquareSoFar.push( paintColor );
            this.visitsPerPanel.set( this.position.getId(), colorsOnThisSquareSoFar );
        }
        else
        {
            // We've never been here before
            this.numUniquePaintJobsApplied++;
            this.visitsPerPanel.set( this.position.getId(), [paintColor] );
        }
    }

    parseDirection( direction: number ): Direction
    {
        let retVal: Direction = {
            dx: 0,
            dy: 0,
            newOrientation: '^'
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
        return this.visitsPerPanel.size
    }

    getNumUniquePaintsApplied(): number
    {
        return this.numUniquePaintJobsApplied;
    }

    drawState( filename?: string ): void
    {
        console.log( `State after ${this.numMovesProcessed} moves:` );
        const furthestPointReached = convertRThetaToXy( this.maxRadiusReached, this.thetaAtMaxRadius );
        const minGridSize = 5;
        const xGrid = Math.max( minGridSize, Math.abs( furthestPointReached.x ) + 1 );
        const yGrid = Math.max( minGridSize, Math.abs( furthestPointReached.y ) + 1 );
        const grid = new Grid<string>( Math.abs( yGrid ) * 2, Math.abs( xGrid ) * 2, '.' );

        // Define (0,0) to be in the middle
        const newOrigin = new Coordinate( -xGrid, -yGrid );
        const positionTranslated = translateCoords( newOrigin, this.position );

        this.visitsPerPanel.forEach( ( colors, coordinateId ) =>
        {
            const xy = coordinateId.split( ',' );
            const x = parseInt( xy[0] );
            const y = parseInt( xy[1] );
            const color = colors[colors.length - 1] === Color.White ? Color.White : Color.Black;
            const point = new Coordinate( x, y );
            const pointTranslated = translateCoords( newOrigin, point );
            grid.set( pointTranslated.y, pointTranslated.x, color );
        } );

        grid.set( positionTranslated.y, positionTranslated.x, this.orientation ); // Draw after to make sure the robot always appears on top
        const originColors = this.visitsPerPanel.get( '0,0' )
        const finalOriginColor = originColors[originColors.length - 1] === Color.Black ? 'B' : 'W';
        grid.set( yGrid, xGrid, finalOriginColor );

        if ( filename )
        {
            fse.writeFileSync( filename, grid.toString( true ).replace( / /g, '' ) );
        }
        else
        {
            console.log( grid.toString( true ) );
        }
    }
}