import { Coordinate } from "./Coord";

export function translateCoords( newOrigin: Coordinate, pointToTranslate: Coordinate ): Coordinate
{
    const translatedX = pointToTranslate.x - newOrigin.x;
    const translatedY = pointToTranslate.y - newOrigin.y;
    const translatedZ = pointToTranslate.z - newOrigin.z;

    let translatedPoint = new Coordinate( translatedX, translatedY, translatedZ );

    return translatedPoint;
}

export function convertXyzToRThetaPhi( x: number, y: number, z: number = 0 ): { r: number, theta: number, phi: number }
{
    const r = roundToNDecimalPlaces( Math.sqrt( x ** 2 + y ** 2 + z ** 2 ), 9 );

    return {
        r: r,
        theta: roundToNDecimalPlaces( Math.atan2( y, x ) * 180 / Math.PI, 9 ),
        phi: Math.acos( z / r ) * 180 / Math.PI
    }
}

export function convertRThetaPhiToXyz( r: number, thetaDegrees: number, phiDegrees: number = 90 ): { x: number, y: number, z: number }
{
    const thetaRad = thetaDegrees * Math.PI / 180;
    const phiRad = phiDegrees * Math.PI / 180;

    return {
        x: roundToNDecimalPlaces( r * Math.sin( phiRad ) * Math.cos( thetaRad ), 9 ),
        y: roundToNDecimalPlaces( r * Math.sin( phiRad ) * Math.sin( thetaRad ), 9 ),
        z: r * Math.cos( phiRad )
    };
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
