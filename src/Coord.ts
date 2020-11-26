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
        this.updatePolarCoordsAndId( this.x, this.y, this.z );
    }

    private updatePolarCoordsAndId( x: number, y: number, z: number = 0 )
    {
        const { r, theta, phi } = convertXyzToRThetaPhi( x, y, z );
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

        this.updatePolarCoordsAndId( this.x, this.y, this.z );
    }
}