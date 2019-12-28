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

    constructor( asteroidMap: string[] )
    {
        this.asteroidCoords = [];
        this.visibilityGraph = new Graph<AsteroidId, AsteroidCoord>();
        this.mapHeight = asteroidMap.length;
        this.mapWidth = asteroidMap[0].length;

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

        // this.printMapWithVisibilityIndices();
        return retVal;
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
                    mapString += '.';
                    continue;
                }
                mapString += this.visibilityGraph.getNodeNeighbors( coords ).size;
            }
            mapString += '\n';
        }
        console.log( mapString );
    }
}