import { Coordinate } from "./Coord";
import { Vector } from "./interfaces";

export class GravitySimulator
{
    private positions: Coordinate[];
    private velocities: Coordinate[];
    private numStepsTaken: number;

    constructor( bodyPositions: Vector[] )
    {
        this.numStepsTaken = 0;
        this.positions = [];
        this.velocities = [];

        bodyPositions.forEach( body =>
        {
            this.positions.push( new Coordinate( body[0], body[1], body[2] ) );
            this.velocities.push( new Coordinate( 0, 0, 0 ) );
        } );
    }

    getNumBodies(): number
    {
        return this.positions.length;
    }

    getNumStepsTaken(): number
    {
        return this.numStepsTaken;
    }

    getPosition( bodyIndex: number ): Coordinate
    {
        if ( bodyIndex < 0 || bodyIndex >= this.positions.length )
            throw new Error( `bodyIndex out of range: ${bodyIndex}` );

        return new Coordinate( this.positions[bodyIndex].x, this.positions[bodyIndex].y, this.positions[bodyIndex].z );
    }

    getVelocity( bodyIndex: number ): Coordinate
    {
        if ( bodyIndex < 0 || bodyIndex >= this.velocities.length )
            throw new Error( `bodyIndex out of range: ${bodyIndex}` );

        return new Coordinate( this.velocities[bodyIndex].x, this.velocities[bodyIndex].y, this.velocities[bodyIndex].z );
    }

    calcNSteps( numSteps: number )
    {
        for ( let i = 0; i < numSteps; i++ )
        {
            this.calcNextStep();
        }
    }

    // Advance the simulation by one time step
    calcNextStep()
    {
        // Update velocity by applying gravity to all bodies
        this.ApplyGravity();

        // Update position of all bodies by applying velocity
        this.ApplyVelocity();

        this.numStepsTaken++;
    }

    calcTotalEnergy(): number
    {
        let totalEnergy = 0;
        for ( let iBody = 0; iBody < this.positions.length; iBody++ )
        {
            const potentialEnergy = this.positions[iBody].calcSumAbs();
            const kineticEnergy = this.velocities[iBody].calcSumAbs();
            totalEnergy += potentialEnergy * kineticEnergy;
        }

        return totalEnergy;
    }

    private ApplyGravity(): void
    {
        for ( let iCurrentBody = 0; iCurrentBody < this.velocities.length; iCurrentBody++ )
        {
            for ( let iOtherBody = iCurrentBody + 1; iOtherBody < this.velocities.length; iOtherBody++ )
            {
                const dvx = this.positions[iOtherBody].x < this.positions[iCurrentBody].x ? -1 : this.positions[iOtherBody].x > this.positions[iCurrentBody].x ? 1 : 0;
                const dvy = this.positions[iOtherBody].y < this.positions[iCurrentBody].y ? -1 : this.positions[iOtherBody].y > this.positions[iCurrentBody].y ? 1 : 0;
                const dvz = this.positions[iOtherBody].z < this.positions[iCurrentBody].z ? -1 : this.positions[iOtherBody].z > this.positions[iCurrentBody].z ? 1 : 0;
                this.velocities[iCurrentBody].move( dvx, dvy, dvz );
                this.velocities[iOtherBody].move( -dvx, -dvy, -dvz );
            }
        }
    }

    private ApplyVelocity(): void
    {
        for ( let i = 0; i < this.positions.length; i++ )
        {
            this.positions[i].add( this.velocities[i] );
        }
    }
}