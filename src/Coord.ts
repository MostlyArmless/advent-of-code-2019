import { convertXyToRTheta } from "./CoordinateTranslator";

export type AsteroidId = string;

export interface IAsteroidCoord
{
    x: number;
    y: number;
    r: number;
    theta: number;
    getAsteroidId(): string;
}

export class AsteroidCoord implements AsteroidCoord
{
    x: number;
    y: number;
    r: number;
    theta: number;
    private id: string;

    constructor( x: number, y: number )
    {
        this.x = x;
        this.y = y;
        const { r, theta } = convertXyToRTheta( x, y );
        this.r = r;
        this.theta = theta;
        this.id = `${this.x},${this.y}`;
    }

    getAsteroidId(): AsteroidId
    {
        return this.id;
    }
}