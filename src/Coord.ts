import { convertRectToPolar } from "./CoordinateTranslator";

export class Coordinate
{
    x: number;
    y: number;
    z: number;
    r: number;
    theta: number;
    phi: number;
    private id: string;

    constructor( x: number, y: number, z?: number )
    {
        this.x = x;
        this.y = y;
        this.z = z === undefined ? 0 : z;

        this.updatePolarAndId( x, y, z );
    }

    private updatePolarAndId( x: number, y: number, z: number )
    {
        const { r, theta, phi } = convertRectToPolar( x, y, z );
        this.r = r;
        this.theta = theta;
        this.phi = phi;

        this.id = `${this.x},${this.y},${this.z}`;
    }

    getId(): string
    {
        return this.id;
    }

    move( dx: number, dy: number, dz?: number ): void
    {
        this.x += dx;
        this.y += dy;
        this.z += dz === undefined ? 0 : dz;

        this.updatePolarAndId( this.x, this.y, this.z );
    }
}