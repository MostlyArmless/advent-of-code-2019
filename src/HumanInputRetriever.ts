import { IStdIn } from "./interfaces";
import * as readline from 'readline-sync';

export class HumanInputRetriever implements IStdIn<bigint>
{
    async getInput(): Promise<bigint>
    {
        return BigInt( readline.question( 'Enter a number: ' ) );
    }
}