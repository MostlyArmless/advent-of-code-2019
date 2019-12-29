import { readProblemTextAsBigIntArray, measureExecutionTime } from "../tools";
import { PaintingRobot } from "../PaintingRobot";
import { IoBuffer } from "../IoBuffer";
import { IntCodeComputer } from "../IntCodeComputer";

const problem11input = readProblemTextAsBigIntArray( './src/problem11input.txt' );

async function problem11a()
{
    const camera = new IoBuffer<bigint>();
    const nextActions = new IoBuffer<bigint>();
    const computer = new IntCodeComputer( camera, nextActions, true );

    const robot = new PaintingRobot( computer, camera, nextActions, problem11input );

    await robot.paint();
    const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();
    console.log( `Answer to problem 11a = ${numPanelsPaintedAtLeastOnce}` );
}

measureExecutionTime( problem11a );