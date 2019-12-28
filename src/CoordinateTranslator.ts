import { AsteroidCoord } from "./Coord";

export function translateCoords( newOrigin: AsteroidCoord, pointToTranslate: AsteroidCoord ): AsteroidCoord
{
    const translatedX = pointToTranslate.x - newOrigin.x;
    const translatedY = pointToTranslate.y - newOrigin.y;

    let translatedPoint = new AsteroidCoord( translatedX, translatedY );

    return translatedPoint;
}

export function convertXyToRTheta( x: number, y: number ): { r: number, theta: number }
{
    return {
        r: roundToNDecimalPlaces( Math.sqrt( x ** 2 + y ** 2 ), 6 ),
        theta: roundToNDecimalPlaces( Math.atan( y / x ), 6 )
    }
}

function roundToNDecimalPlaces( x: number, N: number ): number
{
    return parseFloat( x.toFixed( N ) );
}
