import { Graph } from "./Graph";

type Theta = number;
type R = number;
type AsteroidId = string;

interface AsteroidCoord
{
    x: number;
    y: number;
    r: number;
    theta: number;
}

export interface MonitoringStationInfo
{
    bestStationCoords: AsteroidCoord;
    asteroidsVisibleFromStation: Map<AsteroidId, AsteroidCoord>;
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
                    const { r, theta } = this.convertXyToRTheta( iCol, iRow );
                    const asteroid: AsteroidCoord = {
                        x: iCol,
                        y: iRow,
                        r: r,
                        theta: theta
                    };
                    this.asteroidCoords.push( asteroid );
                    const asteroidId = this.getAsteroidId( asteroid );
                    this.visibilityGraph.addFullyConnectedNode( asteroidId, asteroid );
                }
            }
            iRow++;
        } );
    }

    private getAsteroidId( asteroid: AsteroidCoord ): AsteroidId
    {
        return `${asteroid.x},${asteroid.y}`;
    }

    private convertXyToRTheta( x: number, y: number ): { r: number, theta: number }
    {
        return {
            r: Math.sqrt( x ** 2 + y ** 2 ),
            theta: Math.atan( y / x )
        }
    }

    findBestMonitoringLocation(): MonitoringStationInfo
    {
        // graph pruning method
        // Upon construction, we built a fully connected graph. Now we can iterate the nodes in the graph, deleting edges where the line of sight is blocked
        const nodes = this.visibilityGraph.getAllNodes();
        nodes.forEach( ( currentAsteroid, nodeName ) =>
        {
            const neighbors = this.visibilityGraph.getNodeNeighborsWithValues( nodeName );

            let polarCoordsToNeighbors = new Map<Theta, [R, AsteroidCoord]>();
            neighbors.forEach( neighborAsteroid =>
            {
                if ( this.getAsteroidId( currentAsteroid ) === this.getAsteroidId( neighborAsteroid ) )
                    return;

                const relativeCoords = this.translateCoords( currentAsteroid, neighborAsteroid );
                if ( polarCoordsToNeighbors.has( relativeCoords.theta ) )
                {
                    const otherAsteroidInfo = polarCoordsToNeighbors.get( relativeCoords.theta );
                    const smallestDistanceSoFar = otherAsteroidInfo[0];
                    const otherNeighborAsteroid = otherAsteroidInfo[1];

                    if ( relativeCoords.r < smallestDistanceSoFar )
                    {
                        // This neighbor is closer than the one we previously encountered
                        this.visibilityGraph.deleteEdge( this.getAsteroidId( currentAsteroid ), this.getAsteroidId( otherNeighborAsteroid ) );
                    }
                    else
                    {
                        // The previously encountered neighbor is closer than this neighbor
                        this.visibilityGraph.deleteEdge( this.getAsteroidId( currentAsteroid ), this.getAsteroidId( neighborAsteroid ) );
                    }
                }
                else
                {
                    // This is the first asteroid we've found at this angle. Save it for later
                    polarCoordsToNeighbors.set( relativeCoords.theta, [relativeCoords.r, neighborAsteroid] );
                }
            } );
        } );

        // Now that we've finished pruning the graph, we can ask it how many asteroids are visible from each asteroid
        this.visibilityGraph.printAdjacencies();
        let maxNeighbors = 0;
        let bestNode: AsteroidId = null;
        this.visibilityGraph.adjacencyList.forEach( ( neighbors, nodeName ) =>
        {
            if ( neighbors.size > maxNeighbors )
            {
                maxNeighbors = neighbors.size;
                bestNode = nodeName;
            }
        } );

        const retVal: MonitoringStationInfo = {
            bestStationCoords: this.visibilityGraph.getNodeValue( bestNode ),
            asteroidsVisibleFromStation: this.visibilityGraph.getNodeNeighborsWithValues( bestNode )
        };

        this.printMapWithVisibilityIndices();
        return retVal;
    }

    private translateCoords( newOrigin: AsteroidCoord, pointToTranslate: AsteroidCoord ): AsteroidCoord
    {
        const translatedX = pointToTranslate.x - newOrigin.x;
        const translatedY = pointToTranslate.y - newOrigin.y;
        const { r, theta } = this.convertXyToRTheta( translatedX, translatedY );

        let translatedPoint: AsteroidCoord = {
            x: translatedX,
            y: translatedY,
            r: r,
            theta: theta
        };

        return translatedPoint;
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