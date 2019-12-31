import { readProblemTextAsBigIntArray, measureExecutionTime } from "../tools";
import { PaintingRobot } from "../PaintingRobot";
import { IoBuffer } from "../IoBuffer";
import { IntCodeComputer } from "../IntCodeComputer";
import { LoggingLevel } from "../interfaces";

const problem11input = readProblemTextAsBigIntArray( './src/ProblemsAndInputs/problem11input.txt' );

async function problem11a()
{
    const camera = new IoBuffer<bigint>();
    const nextActions = new IoBuffer<bigint>();
    const computer = new IntCodeComputer( camera, nextActions );

    const robot = new PaintingRobot( computer, camera, nextActions, problem11input, LoggingLevel.Off );

    await robot.paint();
    robot.drawState( './robotPainting.txt' );
    const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();
    const otherCount = robot.getNumUniquePaintsApplied();
    console.log( `Answer to problem 11a = ${numPanelsPaintedAtLeastOnce}, but it might be = ${otherCount}` );
}

measureExecutionTime( problem11a );