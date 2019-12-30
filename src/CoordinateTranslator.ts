import { Coordinate } from "./Coord";

export function translateCoords( newOrigin: Coordinate, pointToTranslate: Coordinate ): Coordinate
{
    const translatedX = pointToTranslate.x - newOrigin.x;
    const translatedY = pointToTranslate.y - newOrigin.y;

    let translatedPoint = new Coordinate( translatedX, translatedY );

    return translatedPoint;
}

export function convertXyToRTheta( x: number, y: number ): { r: number, theta: number }
{
    return {
        r: roundToNDecimalPlaces( Math.sqrt( x ** 2 + y ** 2 ), 9 ),
        theta: roundToNDecimalPlaces( Math.atan2( y, x ) * 180 / Math.PI, 9 )
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
