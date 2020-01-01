import { readFileAsBigIntArray, measureExecutionTime } from "../tools";
import { PaintingRobot } from "../PaintingRobot";
import { IoBuffer } from "../IoBuffer";
import { IntCodeComputer } from "../IntCodeComputer";
import { LoggingLevel } from "../interfaces";

const problem11input = readFileAsBigIntArray( './src/ProblemsAndInputs/problem11input.txt' );

export async function problem11a(): Promise<number>
{
    const camera = new IoBuffer<bigint>();
    const nextActions = new IoBuffer<bigint>();
    const computer = new IntCodeComputer( camera, nextActions );

    const robot = new PaintingRobot( computer, camera, nextActions, problem11input, LoggingLevel.Off );

    await robot.paint();
    robot.drawState( './robotPainting.txt' );
    const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();
    const otherCount = robot.getNumPanelsVisited();

    const answer = numPanelsPaintedAtLeastOnce;
    console.log( `Answer to problem 11a = ${numPanelsPaintedAtLeastOnce}, but it might be = ${otherCount}` );
    return answer;
}

measureExecutionTime( problem11a );