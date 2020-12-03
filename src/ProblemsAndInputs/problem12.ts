import { GravitySimulator } from "../GravitySimulator";
import { Vector } from "../interfaces";
import { PROBLEM_12_INPUT } from "./problem12input";

function parseInitialBodyPositions( input: string ): Vector[]
{
    const regex = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/
    const lines = input.split( '\n' );
    let initialPositions: Vector[] = [];
    lines.forEach( line =>
    {
        const matches = regex.exec( line );
        initialPositions.push( [
            parseInt( matches[1] ),
            parseInt( matches[2] ),
            parseInt( matches[3] )
        ] );
    } );
    return initialPositions;
}

export function problem12a(): number
{
    const initialPositions = parseInitialBodyPositions( PROBLEM_12_INPUT );
    const simulator = new GravitySimulator( initialPositions );
    simulator.calcNSteps( 1000 );
    return simulator.calcTotalEnergy();
}
