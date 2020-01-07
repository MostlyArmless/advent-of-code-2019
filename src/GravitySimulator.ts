import { Coordinate } from "./Coord";

export class GravitySimulator
{
    freeBodies: Coordinate[];

    constructor( initialPositions: Coordinate[] )
    {
        this.freeBodies = Array.from( initialPositions ); // Copy, don't take by reference.
    }

    calcSimulationStep(): Coordinate[]
    {
        return this.freeBodies; // TODO implement this.
    }
}