// Test framework dependencies
// const should = require('chai').should();
const expect = require( 'chai' ).expect;
// const assert = require('chai').assert;
import * as chai from 'chai';
import { WireCrosser, WirePathStr } from '../WireCrosser';
chai.use( require( 'chai-as-promised' ) ); // Extension that defines the "eventually" keyword
chai.use( require( 'chai-string' ) ); // Extension that provides the "string should contain" functionality
let itParam = require( 'mocha-param' );

interface WirePathTestDatum
{
    wirePaths: WirePathStr[];
    expectedOutput: number;
}

const testDataA: WirePathTestDatum[] = [
    {
        wirePaths: ['R8,U5,L5,D3', 'U7,R6,D4,L4'],
        expectedOutput: 6
    },
    {
        wirePaths: ['R75,D30,R83,U83,L12,D49,R71,U7,L72', 'U62,R66,U55,R34,D71,R55,D58,R83'],
        expectedOutput: 159
    },
    {
        wirePaths: ['R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51', 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7'],
        expectedOutput: 135
    }
];

const testDataB: WirePathTestDatum[] = [
    {
        wirePaths: ['R8,U5,L5,D3', 'U7,R6,D4,L4'],
        expectedOutput: 30
    },
    {
        wirePaths: ['R75,D30,R83,U83,L12,D49,R71,U7,L72', 'U62,R66,U55,R34,D71,R55,D58,R83'],
        expectedOutput: 610
    },
    {
        wirePaths: ['R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51', 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7'],
        expectedOutput: 410
    }
];

describe( 'WireCrosser', () =>
{
    let m_testSubject;

    beforeEach( () =>
    {
        // Set up tests
    } );

    itParam( 'getManhattanDistanceToNearestWireCrossing', testDataA, ( value: WirePathTestDatum ) =>
    {
        const enableLogging = false;
        m_testSubject = new WireCrosser( value.wirePaths, enableLogging );
        const result = m_testSubject.getManhattanDistanceToNearestWireCrossing();
        expect( result ).to.equal( value.expectedOutput );
    } );

    itParam( 'minimizeSignalDelay', testDataB, ( value: WirePathTestDatum ) =>
    {
        const enableLogging = false;
        m_testSubject = new WireCrosser( value.wirePaths, enableLogging );
        const result = m_testSubject.minimizeSignalDelay();
        expect( result ).to.equal( value.expectedOutput );
    } );

    afterEach( () =>
    {
        // Tear down tests
    } );
} );