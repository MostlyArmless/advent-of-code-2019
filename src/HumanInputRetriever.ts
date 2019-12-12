import { IStdIn } from "./interfaces";
import * as readline from 'readline-sync';

export class HumanInputRetriever implements IStdIn
{
    getInput(): number
    {
        return parseInt( readline.question( 'Enter a number: ' ) );
    }
}