import { PaintingRobot } from "../PaintingRobot";
import { IoBuffer } from "../IoBuffer";
import { IntCodeComputer } from "../IntCodeComputer";
import { LoggingLevel } from "../interfaces";
import { Memory } from "../Memory";

export async function problem11a( problemInput: bigint[] ): Promise<number>
{
    const computerBufferTimeoutMilliseconds = 2;
    const camera = new IoBuffer<bigint>( computerBufferTimeoutMilliseconds );
    const nextActions = new IoBuffer<bigint>( computerBufferTimeoutMilliseconds );
    const computer = new IntCodeComputer( new Memory(), camera, nextActions );

    const robot = new PaintingRobot( computer, camera, nextActions, problemInput, LoggingLevel.Off );

    await robot.paint();
    robot.drawStateAsText( './problem11Image.txt' );
    robot.drawStateAsImage( './problem11Output.bmp' );
    const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();

    const answer = numPanelsPaintedAtLeastOnce;
    console.log( `Answer to problem 11a = ${numPanelsPaintedAtLeastOnce}` );
    return answer;
}