import { convertXyToRTheta } from "./CoordinateTranslator";

export class Coordinate
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
        this.updateRThetaId( x, y );
    }

    private updateRThetaId( x: number, y: number )
    {
        const { r, theta } = convertXyToRTheta( x, y );
        this.r = r;
        this.theta = theta;
        this.id = `${this.x},${this.y}`;
    }

    getId(): string
    {
        return this.id;
    }

    move( dx: number, dy: number ): void
    {
        this.x += dx;
        this.y += dy;
        this.updateRThetaId( this.x, this.y );
    }
}