import { PaintingRobot } from "../PaintingRobot";
import { IoBuffer } from "../IoBuffer";
import { IntCodeComputer } from "../IntCodeComputer";
import { LoggingLevel, PaintColor } from "../interfaces";
import { Memory } from "../Memory";

export async function problem11a( problemInput: bigint[] ): Promise<number>
{
    const computerBufferTimeoutMilliseconds = 2;
    const camera = new IoBuffer<bigint>( computerBufferTimeoutMilliseconds );
    const nextActions = new IoBuffer<bigint>( computerBufferTimeoutMilliseconds );
    const computer = new IntCodeComputer( new Memory(), camera, nextActions );

    const robot = new PaintingRobot( computer, camera, nextActions, problemInput, LoggingLevel.Off );

    const startingPanelColor = PaintColor.Black;
    await robot.paint( startingPanelColor );
    await robot.drawStateAsImage( './bitmaps/problem11a_output.bmp' );
    const numPanelsPaintedAtLeastOnce = robot.getNumPanelsPaintedAtLeastOnce();

    const answer = numPanelsPaintedAtLeastOnce;
    console.log( `Answer to problem 11a = ${numPanelsPaintedAtLeastOnce}` );
    return answer;
}

export async function problem11b( problemInput: bigint[] ): Promise<void>
{
    const computerBufferTimeoutMilliseconds = 2;
    const camera = new IoBuffer<bigint>( computerBufferTimeoutMilliseconds );
    const nextActions = new IoBuffer<bigint>( computerBufferTimeoutMilliseconds );
    const computer = new IntCodeComputer( new Memory(), camera, nextActions );

    const robot = new PaintingRobot( computer, camera, nextActions, problemInput, LoggingLevel.Off );

    const startingPanelColor = PaintColor.White;
    await robot.paint( startingPanelColor );
    const outputFile = './bitmaps/problem11b_output.bmp';
    await robot.drawStateAsImage( outputFile );

    console.log( `For the answer to problem 11b, open the file: "${outputFile}"` );
}