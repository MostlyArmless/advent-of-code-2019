import { Graph } from "./Graph";
import { translateCoords } from "./CoordinateTranslator";
import { AsteroidId, AsteroidCoord } from "./Coord";

type Theta = number;
type R = number;

export interface MonitoringStationInfo
{
    bestStationCoords: AsteroidCoord;
    asteroidsVisibleFromBestStation: Map<AsteroidId, AsteroidCoord>;
}

export class AsteroidDetector
{
    asteroidCoords: AsteroidCoord[];
    visibilityGraph: Graph<AsteroidId, AsteroidCoord>;
    mapWidth: number;
    mapHeight: number;
    private bestMonitoringLocation: AsteroidCoord;
    private laserFiringOrder: AsteroidId[];

    constructor( asteroidMap: string[] )
    {
        this.asteroidCoords = [];
        this.visibilityGraph = new Graph<AsteroidId, AsteroidCoord>();
        this.mapHeight = asteroidMap.length;
        this.mapWidth = asteroidMap[0].length;
        this.bestMonitoringLocation = null;
        this.laserFiringOrder = [];
        this.parseAsteroidMap( asteroidMap );
    }

    private parseAsteroidMap( asteroidMap: string[] ): void
    {
        let iRow = 0;
        asteroidMap.forEach( line =>
        {
            for ( let iCol = 0; iCol < line.length; iCol++ )
            {
                if ( line[iCol] === '#' )
                {
                    this.addNewAsteroidWithConnections( iCol, iRow );
                }
            }
            iRow++;
        } );
    }

    private addNewAsteroidWithConnections( iCol: number, iRow: number )
    {
        const asteroid = new AsteroidCoord( iCol, iRow );
        this.asteroidCoords.push( asteroid );
        const asteroidId = asteroid.getAsteroidId();

        // This asteroid exists, so create a node for it
        this.visibilityGraph.addNode( asteroidId, asteroid );

        // Now connect this node in the graph to ONLY other nodes it can actually see
        let polarCoordsToNeighbors = new Map<Theta, [R, AsteroidCoord]>();

        this.visibilityGraph.nodeValues.forEach( ( otherAsteroid, id ) =>
        {
            const relativeCoords = translateCoords( asteroid, otherAsteroid );
            if ( polarCoordsToNeighbors.has( relativeCoords.theta ) )
            {
                // There are other asteroids along this axis.
                const closestAlongThisAxisSoFar = polarCoordsToNeighbors.get( relativeCoords.theta );
                if ( relativeCoords.r < closestAlongThisAxisSoFar[0] )
                {
                    // replace previous closest with this one
                    polarCoordsToNeighbors.set( relativeCoords.theta, [relativeCoords.r, otherAsteroid] );
                }
            }
            else
            {
                // This is the first other asteroid we've seen along this axis
                polarCoordsToNeighbors.set( relativeCoords.theta, [relativeCoords.r, otherAsteroid] );
            }
        } );

        // Now that we've found the closest asteroid in each direction, add edges between this asteroid and those ones.
        polarCoordsToNeighbors.forEach( ( value, key ) =>
        {
            this.visibilityGraph.addEdge( asteroidId, value[1].getAsteroidId() );
        } );
    }

    findBestMonitoringLocation(): MonitoringStationInfo
    {
        let bestNode = '';
        let maxNeighborsSoFar = Number.MIN_SAFE_INTEGER;

        this.visibilityGraph.adjacencyList.forEach( ( neighbors, nodeId ) =>
        {
            if ( neighbors.size > maxNeighborsSoFar )
            {
                bestNode = nodeId;
                maxNeighborsSoFar = neighbors.size;
            }
        } );

        const retVal: MonitoringStationInfo = {
            bestStationCoords: this.visibilityGraph.getNodeValue( bestNode ),
            asteroidsVisibleFromBestStation: this.visibilityGraph.getNodeNeighborsWithValues( bestNode )
        };

        this.bestMonitoringLocation = retVal.bestStationCoords;
        return retVal;
    }

    calculateLaserFiringOrder(): AsteroidId[]
    {
        if ( this.bestMonitoringLocation === null )
            this.findBestMonitoringLocation();

        let laserFiringOrder: AsteroidId[] = [];
        const translationBackToOriginalOrigin = new AsteroidCoord( -this.bestMonitoringLocation.x, -this.bestMonitoringLocation.y );

        // Translate the coordinates of every asteroid such that the laser is at the origin
        const asteroidRelativePositions = this.asteroidCoords.map( asteroid =>
        {
            return translateCoords( this.bestMonitoringLocation, asteroid )
        } );

        // Convert Map to Array so we have random access capability
        const asteroidsPerAngle = Array.from( this.binAsteroidsByAngle( asteroidRelativePositions ) );

        let numAsteroidsToDestroy = asteroidRelativePositions.length - 1; // subtract 1 to account for the laser station itself

        while ( laserFiringOrder.length < numAsteroidsToDestroy )
        {
            // Start a new rotation
            for ( let i = 0; i < asteroidsPerAngle.length; i++ )
            {
                if ( laserFiringOrder.length === numAsteroidsToDestroy )
                    break;

                const nextAsteroidToDestroy = asteroidsPerAngle[i][1].pop();
                if ( nextAsteroidToDestroy === undefined || nextAsteroidToDestroy.getAsteroidId() === '0,0' )
                    continue;

                const nextAsteroidToDestroyOriginalCoordinates = translateCoords( translationBackToOriginalOrigin, nextAsteroidToDestroy );
                laserFiringOrder.push( nextAsteroidToDestroyOriginalCoordinates.getAsteroidId() );
            }
        }

        this.laserFiringOrder = laserFiringOrder;
        return laserFiringOrder;
    }

    private binAsteroidsByAngle( asteroidRelativePositions: AsteroidCoord[] ): Map<Theta, AsteroidCoord[]>
    {
        let asteroidsPerAngle: Map<Theta, AsteroidCoord[]> = new Map<Theta, AsteroidCoord[]>();
        asteroidRelativePositions.forEach( asteroid =>
        {
            let asteroidsAtThisAngle = asteroidsPerAngle.has( asteroid.theta ) ? asteroidsPerAngle.get( asteroid.theta ) : [];
            asteroidsAtThisAngle.push( asteroid );
            asteroidsPerAngle.set( asteroid.theta, asteroidsAtThisAngle );
        } );

        asteroidsPerAngle = new Map( [...asteroidsPerAngle.entries()].sort( ( a, b ) =>
        {
            return isNaN( a[0] ) ? 1 : a[0] - b[0];
        } ) ); // Sort the keys so we can iterate in some sensible order later

        asteroidsPerAngle.forEach( ( val, key ) =>
        {
            // At each theta, sort the array from furthest to nearest (so .pop() returns nearest each time it is called)
            const valSorted = val.sort( ( a, b ) =>
            {
                const rDiff = b.r - a.r;
                if ( rDiff === 0 )
                {
                    return b.theta - a.theta;
                }

                return rDiff;
            } );
            asteroidsPerAngle.set( key, valSorted );
        } );

        // Now the keys are sorted in ascending order but we want to rotate the keys such that we start at -90 degrees
        let sorted = [...asteroidsPerAngle.entries()];
        while ( sorted[0][0] !== -90 )
        {
            const firstElement = sorted.shift();
            if ( isNaN( firstElement[0] ) )
                continue;

            sorted.push( firstElement );
        }

        let sortedMap = new Map( sorted );

        // Remove the laser station itself from the map
        let asteroidsAtZeroDegrees = sortedMap.get( 0 );
        asteroidsAtZeroDegrees.pop();
        return sortedMap;
    }

    printMapWithVisibilityIndices(): void
    {
        let mapString = '';

        for ( let iRow = 0; iRow < this.mapHeight; iRow++ )
        {
            for ( let iCol = 0; iCol < this.mapWidth; iCol++ )
            {
                const coords = `${iCol},${iRow}`;
                if ( !this.visibilityGraph.hasNode( coords ) )
                {
                    mapString += '. ';
                    continue;
                }
                mapString += this.visibilityGraph.getNodeNeighbors( coords ).size + ' ';
            }
            mapString += '\n';
        }
        console.log( mapString );
    }

    printAsteroidDestructionOrderMap(): void
    {
        let mapString = '';

        for ( let iRow = 0; iRow < this.mapHeight; iRow++ )
        {
            for ( let iCol = 0; iCol < this.mapWidth; iCol++ )
            {
                const coords = `${iCol},${iRow}`;
                if ( !this.visibilityGraph.hasNode( coords ) )
                {
                    mapString += '.  ';
                    continue;
                }

                if ( coords === this.bestMonitoringLocation.getAsteroidId() )
                {
                    mapString += 'X  ';
                    continue;
                }

                let destructionIndex = ( this.laserFiringOrder.findIndex( ( asteroidId ) => { return asteroidId === coords } ) + 1 ).toString();
                while ( destructionIndex.length < 3 )
                {
                    destructionIndex += ' '; // Pad with the right amount of space
                }

                mapString += destructionIndex;
            }
            mapString += '\n\n';
        }
        console.log( mapString );
    }
}