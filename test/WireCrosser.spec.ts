// Test framework dependencies
// const should = require('chai').should();
const expect = require( 'chai' ).expect;
// const assert = require('chai').assert;
import * as chai from 'chai';
import { WireCrosser } from '../src/WireCrosser';
chai.use( require( 'chai-as-promised' ) ); // Extension that defines the "eventually" keyword
chai.use( require( 'chai-string' ) ); // Extension that provides the "string should contain" functionality

describe( 'WireCrosser', () =>
{
    let m_testSubject: WireCrosser;
    const enableLogging = false;

    describe( 'getManhattanDistanceToNearestWireCrossing', () =>
    {
        it( 'Manhattan Distance A', () =>
        {
            const wirePaths = ['R8,U5,L5,D3', 'U7,R6,D4,L4'];
            m_testSubject = new WireCrosser( wirePaths, enableLogging );
            expect( m_testSubject.getManhattanDistanceToNearestWireCrossing() ).to.equal( 6 );
        } );

        it( 'Manhattan Distance B', () =>
        {
            const wirePaths = ['R75,D30,R83,U83,L12,D49,R71,U7,L72', 'U62,R66,U55,R34,D71,R55,D58,R83'];
            m_testSubject = new WireCrosser( wirePaths, enableLogging );
            expect( m_testSubject.getManhattanDistanceToNearestWireCrossing() ).to.equal( 159 );
        } );

        it( 'Manhattan Distance C', () =>
        {
            const wirePaths = ['R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51', 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7'];
            m_testSubject = new WireCrosser( wirePaths, enableLogging );
            expect( m_testSubject.getManhattanDistanceToNearestWireCrossing() ).to.equal( 135 );
        } );
    } );

    describe( 'minimizeSignalDelay', () =>
    {
        const enableLogging = true;

        it( 'Signal Delay A', () =>
        {
            const wirePaths = ['R8,U5,L5,D3', 'U7,R6,D4,L4'];
            m_testSubject = new WireCrosser( wirePaths, enableLogging );
            expect( m_testSubject.minimizeSignalDelay() ).to.equal( 30 );
        } );

        it( 'Signal Delay B', () =>
        {
            const wirePaths = ['R75,D30,R83,U83,L12,D49,R71,U7,L72', 'U62,R66,U55,R34,D71,R55,D58,R83'];
            m_testSubject = new WireCrosser( wirePaths, enableLogging );
            expect( m_testSubject.minimizeSignalDelay() ).to.equal( 610 );
        } );

        it( 'Signal Delay C', () =>
        {
            const wirePaths = ['R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51', 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7'];
            m_testSubject = new WireCrosser( wirePaths, enableLogging );
            expect( m_testSubject.minimizeSignalDelay() ).to.equal( 410 );
        } );

    } );
} );