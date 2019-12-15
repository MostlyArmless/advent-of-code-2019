import { IStdIn } from "./interfaces";
import * as readline from 'readline-sync';

export class HumanInputRetriever implements IStdIn
{
    async getInput(): Promise<number>
    {
        return parseInt( readline.question( 'Enter a number: ' ) );
    }
}