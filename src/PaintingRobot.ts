import { Coordinate } from "./Coord";
import { Grid } from "./Grid";
import { IoBuffer } from "./IoBuffer";
import { IComputer } from "./interfaces";

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
    private radiusToDisplay: number;
    private numMovesProcessed: number;

    constructor( computer: IComputer, camera: IoBuffer<bigint>, nextActions: IoBuffer<bigint>, program: bigint[] )
    {
        this.camera = camera;
        this.nextActions = nextActions;
        this.computer = computer;

        this.computer.loadProgram( program );
        this.visitsPerPanel = new Map<CoordinateId, Color[]>();
        this.radiusToDisplay = 3;
        this.position = new Coordinate( 0, 0 );
        this.orientation = '^';
        this.numMovesProcessed = 0;
    }

    async paint(): Promise<void>
    {
        this.camera.sendOutput( 0n ); // First thing we see is definitely going to be black, since the whole ship is black to start with.

        this.computer.runProgram();
        this.drawState();

        while ( this.computer.isRunning )
        {
            const paintColorIndex = Number( await this.nextActions.getInput() );
            const paintColor = paintColorIndex === 0 ? Color.Black : Color.White;
            const direction = Number( await this.nextActions.getInput() );

            const { dx, dy, newOrientation } = this.parseDirection( direction );
            this.paintCurrentPosition( paintColor );
            this.position.move( dx, dy );
            this.orientation = newOrientation;
            const colorOfNewPosition = this.getColorAtCurrentPosition();

            this.radiusToDisplay = Math.max( this.radiusToDisplay, this.position.x, this.position.y );

            this.numMovesProcessed++;
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
        let colorsOnThisSquareSoFar = this.visitsPerPanel.has( this.position.getId() ) ? this.visitsPerPanel.get( this.position.getId() ) : [];
        colorsOnThisSquareSoFar.push( paintColor );
        this.visitsPerPanel.set( this.position.getId(), colorsOnThisSquareSoFar );
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

    drawState(): void
    {
        console.log( `State after ${this.numMovesProcessed} moves:` );
        const grid = new Grid<string>( this.radiusToDisplay, this.radiusToDisplay, '.' );

        grid.set( this.position.y, this.position.x, this.orientation );

        this.visitsPerPanel.forEach( ( colors, coordinateId ) =>
        {
            const xy = coordinateId.split( ',' );
            const x = parseInt( xy[0] );
            const y = parseInt( xy[1] );
            const color = colors[colors.length - 1] === Color.White ? Color.White : Color.Black;;
            grid.set( x, y, color );
        } );

        console.log( grid.toString() );
        console.log(); // Blank line for separation
    }
}