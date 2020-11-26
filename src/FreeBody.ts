import { Coordinate } from "./Coord";

export class FreeBody
{
    private position: Coordinate;
    private velocity: Coordinate;

    constructor( initialPosition: Coordinate, initialVelocity?: Coordinate )
    {
        this.position = initialPosition;
        this.velocity = initialVelocity === undefined ? new Coordinate( 0, 0, 0 ) : initialVelocity;
    }

    getPosition(): Coordinate
    {
        return this.position;
    }

    getVelocity(): Coordinate
    {
        return this.velocity;
    }

    // Calculate the change in velocity to THIS body based on another body's gravity. You should call this func for both bodies when simulating
    applyGravity( otherBodyPosition: Coordinate ): void
    {
        const ax = Math.sign( otherBodyPosition.x - this.position.x );
        const ay = Math.sign( otherBodyPosition.y - this.position.y );
        const az = Math.sign( otherBodyPosition.z - this.position.z );

        this.velocity.move( ax, ay, az );
    }

    applyOwnVelocity(): void
    {
        this.position.move( this.velocity.x, this.velocity.y, this.velocity.z );
    }
}