import { Coordinate } from "./Coord";

export function translateCoords( newOrigin: Coordinate, pointToTranslate: Coordinate ): Coordinate
{
    const translatedX = pointToTranslate.x - newOrigin.x;
    const translatedY = pointToTranslate.y - newOrigin.y;
    const translatedZ = pointToTranslate.z - newOrigin.z;

    let translatedPoint = new Coordinate( translatedX, translatedY, translatedZ );

    return translatedPoint;
}

export function convertRectToPolar( x: number, y: number, z?: number ): { r: number, theta: number, phi: number }
{
    z = z === undefined ? 0 : z;

    const r = roundToNDecimalPlaces( Math.sqrt( x ** 2 + y ** 2 + z ** 2 ), 9 );
    return {
        r: r,
        theta: roundToNDecimalPlaces( Math.atan2( y, x ) * 180 / Math.PI, 9 ),
        phi: Math.acos( z / r )
    }
}

export function convertPolarToRect( r: number, thetaDegrees: number, phiDegrees?: number ): { x: number, y: number, z: number }
{
    phiDegrees = phiDegrees === undefined ? 0 : phiDegrees;

    return {
        x: roundToNDecimalPlaces( r * Math.sin( thetaDegrees * Math.PI / 180 ) * Math.cos( phiDegrees * Math.PI / 180 ), 9 ),
        y: roundToNDecimalPlaces( r * Math.sin( thetaDegrees * Math.PI / 180 ) * Math.sin( phiDegrees * Math.PI / 180 ), 9 ),
        z: roundToNDecimalPlaces( r * Math.cos( thetaDegrees * Math.PI / 180 ), 9 )
    }
}

export function convertDegreesToRadians( deg: number ): number
{
    return roundToNDecimalPlaces( deg * Math.PI / 180, 9 );
}

export function convertRadiansToDegrees( rad: number ): number
{
    return roundToNDecimalPlaces( rad * 180 / Math.PI, 9 );
}

function roundToNDecimalPlaces( x: number, N: number ): number
{
    return parseFloat( x.toFixed( N ) );
}
