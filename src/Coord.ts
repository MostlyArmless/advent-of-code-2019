import { convertXyzToRThetaPhi } from "./CoordinateTranslator";

export class Coordinate
{
    x: number;
    y: number;
    z: number;

    r: number;
    theta: number;
    phi: number;

    private id: string;

    constructor( x: number, y: number, z: number = 0 )
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.updatePolarCoordsAndId();
    }

    updatePolarCoordsAndId()
    {
        const { r, theta, phi } = convertXyzToRThetaPhi( this.x, this.y, this.z );
        this.r = r;
        this.theta = theta;
        this.phi = phi;

        this.id = `${this.x},${this.y},${this.z}`;
    }

    getId(): string
    {
        return this.id;
    }

    move( dx: number, dy: number, dz: number = 0 ): void
    {
        this.x += dx;
        this.y += dy;
        this.z += dz;
        this.updatePolarCoordsAndId();
    }

    add( vector: Coordinate ): void
    {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        this.updatePolarCoordsAndId();
    }

    scale( scalingFactor: number ): void
    {
        this.x *= scalingFactor;
        this.y *= scalingFactor;
        this.z *= scalingFactor;
        this.updatePolarCoordsAndId();
    }

    calcSumAbs( nDimensions: 2 | 3 = 3 ): number
    {
        return Math.abs( this.x ) + Math.abs( this.y ) + ( nDimensions === 3 ? Math.abs( this.z ) : 0 );
    }
}

export function idToCoord( id: string ): Coordinate
{
    const coords: number[] = id.split( ',' ).map( e => parseInt( e ) );
    if ( coords.length === 3 )
        return new Coordinate( coords[0], coords[1], coords[2] );
    else if ( coords.length === 2 )
        return new Coordinate( coords[0], coords[1] );
    else
        throw new Error( 'Invalid ID supplied to idToCoord' );
}

export function calcVectorSum( coords: Coordinate[] ): Coordinate
{
    let sum = new Coordinate( coords[0].x, coords[0].y, coords[0].z );

    for ( let i = 1; i < coords.length; i++ )
    {
        sum.add( coords[i] );
    }
    return sum;
}

export function calcCenterOfMass( coords: Coordinate[], round: boolean = false ): Coordinate
{
    let sum = calcVectorSum( coords );
    sum.scale( 1 / coords.length );
    if ( round )
    {
        sum.x = Math.round( sum.x );
        sum.y = Math.round( sum.y );
        sum.z = Math.round( sum.z );
        sum.updatePolarCoordsAndId();
    }
    return sum
}