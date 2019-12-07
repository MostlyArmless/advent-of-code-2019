
export type WirePathStr = string;
type Wirepath = string[];
type Coordinate = number[];
type CoordStr = string;
type WireIndex = number;
type WireLengthAtCollisionPoint = number;

export class WireCrosser
{
    wirePaths: Wirepath[];
    occupiedPoints: Map<CoordStr, Map<WireIndex, WireLengthAtCollisionPoint>>;
    collisionPoints: Map<CoordStr, Map<WireIndex, WireLengthAtCollisionPoint>>;
    positiveDirections: Set<string>;
    leftRightDirections: Set<string>;
    enableLogging: boolean;

    constructor( wirePaths: WirePathStr[], enableLogging?: boolean )
    {
        this.wirePaths = wirePaths.map( pathStr => { return pathStr.split( ',' ); } );
        this.occupiedPoints = new Map<CoordStr, Map<WireIndex, WireLengthAtCollisionPoint>>();
        this.collisionPoints = new Map<CoordStr, Map<WireIndex, WireLengthAtCollisionPoint>>();
        this.positiveDirections = new Set<string>( ['U', 'R'] );
        this.leftRightDirections = new Set<string>( ['L', 'R'] );
        this.enableLogging = enableLogging ? true : false;
    }

    log( msg: string )
    {
        if ( this.enableLogging )
            console.log( msg );
    }

    getManhattanDistanceToNearestWireCrossing()
    {
        this.AddAllWires();

        if ( this.collisionPoints.size === 0 )
            return null;

        let closestCollision = Number.MAX_SAFE_INTEGER;
        for ( const collision of this.collisionPoints )
        {
            const coordStr = collision[0];
            const colliders = collision[1];
            const distance = this.getManhattanDistanceToPointFromOrigin( coordStr );

            this.log( `Collision at ${coordStr} between wires: ${[...colliders].join( ', ' )}` );
            closestCollision = Math.min( closestCollision, distance );
        }

        return closestCollision;
    }

    minimizeSignalDelay()
    {
        this.AddAllWires();

        let bestCoords = '0,0';
        let bestCombinedLength = Number.MAX_SAFE_INTEGER;

        for ( const intersection of this.collisionPoints )
        {
            let { combinedLength, coordStr } = this.GetCombinedLengthAtIntersection( intersection );

            if ( combinedLength < bestCombinedLength )
            {
                bestCombinedLength = combinedLength;
                bestCoords = coordStr;
            }
        }

        console.log( `Best combined length = ${bestCombinedLength} at intersection ${bestCoords}` );
        return bestCombinedLength;
    }

    private GetCombinedLengthAtIntersection( intersection: [string, Map<number, number>] )
    {
        const coordStr = intersection[0];
        const wiresHere = intersection[1];
        let combinedLength = 0;
        wiresHere.forEach( ( wireLength ) =>
        {
            combinedLength += wireLength;
        } );
        return { combinedLength, coordStr };
    }

    private getManhattanDistanceToPointFromOrigin( coordStr: string ): number
    {
        const coord = coordStr.split( ',' ).map( value => { return parseInt( value ); } );
        return Math.abs( coord[0] ) + Math.abs( coord[1] );
    }

    private AddAllWires()
    {
        let iWire = 0;
        for ( const wirePath of this.wirePaths )
        {
            iWire++;
            this.parseWirePath( wirePath, iWire );
        }
    }

    private parseWirePath( wirepath: Wirepath, iWire: WireIndex )
    {
        let currentPosition: Coordinate = [0, 0];
        let wireLength = 0;

        wirepath.forEach( instruction =>
        {
            const direction = instruction[0];
            const magnitude = parseInt( instruction.slice( -( instruction.length - 1 ) ) );
            const sign = this.positiveDirections.has( direction ) ? 1 : -1;

            const dx = this.leftRightDirections.has( direction ) ? magnitude * sign : 0;
            const dy = !this.leftRightDirections.has( direction ) ? magnitude * sign : 0;

            // Mark intermediate points as occupied:
            const axis = dx === 0 ? 1 : 0;
            let coord = Array.from( currentPosition ); //copy

            for ( let i = 0; i < magnitude; i++ )
            {
                coord[axis] += sign;
                wireLength += 1;

                const coordStr = coord.toString();
                this.log( `wire ${iWire} at ${coordStr}` );

                if ( this.WireCrossesAnotherWireHere( coordStr, iWire ) )
                {
                    const wiresAlreadyHere: Map<WireIndex, WireLengthAtCollisionPoint> = this.occupiedPoints.get( coordStr );

                    // If this is the first collision here, we need to mark the first wire that already exists here as a collision wire
                    if ( wiresAlreadyHere.size === 1 )
                    {
                        for ( const mapEntry of wiresAlreadyHere )
                        {
                            const iWire = mapEntry[0];
                            const wireLength = mapEntry[1];
                            this.AddCollisionHere( coordStr, iWire, wireLength );
                        }
                    }

                    // Add the new wire as a collision
                    this.AddCollisionHere( coordStr, iWire, wireLength );
                }

                this.AddOccupantHere( coordStr, iWire, wireLength );
            };

            currentPosition = [currentPosition[0] + dx, currentPosition[1] + dy];
        } );
    }

    private AddOccupantHere( coordStr: string, iWire: number, wireLength: number )
    {
        if ( this.occupiedPoints.has( coordStr ) )
        {
            let wiresHere = this.occupiedPoints.get( coordStr );
            wiresHere.set( iWire, wireLength );
            this.occupiedPoints.set( coordStr, wiresHere );
        }
        else
        {
            this.occupiedPoints.set( coordStr, new Map<number, number>( [[iWire, wireLength]] ) );
        }
    }

    private AddCollisionHere( coordStr: string, iWire: number, wireLengthHere: number )
    {
        if ( this.collisionPoints.has( coordStr ) )
        {
            let wiresHere = this.occupiedPoints.get( coordStr );
            wiresHere.set( iWire, wireLengthHere );
            this.collisionPoints.set( coordStr, wiresHere );
        }
        else
        {
            this.collisionPoints.set( coordStr, new Map<WireIndex, WireLengthAtCollisionPoint>( [[iWire, wireLengthHere]] ) );
        }
    }

    private WireCrossesAnotherWireHere( coordStr: CoordStr, currentWireIndex: WireIndex ): boolean
    {
        const wiresHere = this.occupiedPoints.get( coordStr );
        if ( !wiresHere )
            return false;

        return wiresHere.size > 1 ? true : !wiresHere.has( currentWireIndex );
    }
}