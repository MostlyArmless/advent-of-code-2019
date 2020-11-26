import { FreeBody } from "../src/FreeBody";
import { Coordinate } from "../src/Coord";
import { expect } from "chai";

describe( 'FreeBody', () =>
{
    it( 'Apply gravity', () =>
    {
        const ganymede = new FreeBody( new Coordinate( 3, 3, 3 ) );
        const callisto = new FreeBody( new Coordinate( 5, 5, 5 ) );

        ganymede.applyGravity( callisto.getPosition() );
        callisto.applyGravity( ganymede.getPosition() );

        expect( ganymede.getPosition().x ).to.equal( 3 ); // Position does not change
        expect( ganymede.getVelocity().x ).to.equal( 1 ); // Velocity increased by 1

        expect( callisto.getPosition().x ).to.equal( 5 ); // Position does not change
        expect( callisto.getVelocity().x ).to.equal( -1 ); // Velocity decreased by 1
    } );

    it( 'Apply velocity', () =>
    {
        const initialPosition = new Coordinate( 1, 2, 3 );
        const initialVelocity = new Coordinate( 4, -5, 6 );
        const body = new FreeBody( initialPosition, initialVelocity );
        body.applyOwnVelocity();

        expect( body.getPosition().x ).to.equal( 5 );
        expect( body.getPosition().y ).to.equal( -3 );
        expect( body.getPosition().z ).to.equal( 9 );

        expect( body.getVelocity().x ).to.equal( 4 );
        expect( body.getVelocity().y ).to.equal( -5 );
        expect( body.getVelocity().z ).to.equal( 6 );
    } );
} );