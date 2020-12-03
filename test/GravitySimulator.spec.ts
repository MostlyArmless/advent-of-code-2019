import { expect } from "chai";
import { Coordinate } from "../src/Coord";
import { GravitySimulator } from "../src/GravitySimulator";
import { Vector } from "../src/interfaces";

interface IBody
{
    position: Coordinate;
    velocity: Coordinate;
}
interface ITimeStep
{
    simulationStep: number;
    bodies: IBody[];
}
type IGravTestData = ITimeStep[];

const simulatorTest = ( testSubject: GravitySimulator, expectedSimulationResults: IGravTestData, expectedFinalTotalEnergy: number ) =>
{
    let iPause = 0;
    let nextPause = expectedSimulationResults[iPause].simulationStep;
    const totalSimStepsToTake = expectedSimulationResults[expectedSimulationResults.length - 1].simulationStep;

    for ( let iStep = 0; iStep < totalSimStepsToTake; iStep++ )
    {
        expect( testSubject.getNumStepsTaken() ).to.equal( iStep );
        if ( iStep === nextPause )
        {
            for ( let iBody = 0; iBody < testSubject.getNumBodies(); iBody++ )
            {
                expect( testSubject.getVelocity( iBody ).getId(), `Bad velocity for body ${iBody} after simulation step ${iStep}` ).to.equal( expectedSimulationResults[iStep].bodies[iBody].velocity.getId() );
                expect( testSubject.getPosition( iBody ).getId(), `Bad position for body ${iBody} after simulation step ${iStep}` ).to.equal( expectedSimulationResults[iStep].bodies[iBody].position.getId() );
            }
            nextPause = iPause < expectedSimulationResults.length ? expectedSimulationResults[iPause].simulationStep : null;
        }

        testSubject.calcNextStep();
    }

    // After all steps:
    expect( testSubject.getNumStepsTaken() ).to.be.equal( expectedSimulationResults[expectedSimulationResults.length - 1].simulationStep );
    expect( testSubject.calcTotalEnergy(), `Total energy incorrect` ).to.equal( expectedFinalTotalEnergy );
};

describe( 'GravitySimulator', () =>
{
    const sim1InitialPositions: Vector[] = [
        [-1, 0, 2],
        [2, -10, -7],
        [4, -8, 8],
        [3, 5, -1]
    ];

    const sim1ExpectedResults: IGravTestData = [
        {
            simulationStep: 0,
            bodies: [
                {
                    "position": new Coordinate( -1, 0, 2 ),
                    "velocity": new Coordinate( 0, 0, 0 )
                },
                {
                    "position": new Coordinate( 2, -10, -7 ),
                    "velocity": new Coordinate( 0, 0, 0 )
                },
                {
                    "position": new Coordinate( 4, -8, 8 ),
                    "velocity": new Coordinate( 0, 0, 0 )
                },
                {
                    "position": new Coordinate( 3, 5, -1 ),
                    "velocity": new Coordinate( 0, 0, 0 )
                },
            ]
        },
        {
            simulationStep: 1,
            bodies: [
                {
                    "position": new Coordinate( 2, -1, 1 ),
                    "velocity": new Coordinate( 3, -1, -1 )
                },
                {
                    "position": new Coordinate( 3, -7, -4 ),
                    "velocity": new Coordinate( 1, 3, 3 )
                },
                {
                    "position": new Coordinate( 1, -7, 5 ),
                    "velocity": new Coordinate( -3, 1, -3 )
                },
                {
                    "position": new Coordinate( 2, 2, 0 ),
                    "velocity": new Coordinate( -1, -3, 1 )
                },
            ]
        },
        {
            simulationStep: 2,
            bodies: [
                {
                    "position": new Coordinate( 5, -3, -1 ),
                    "velocity": new Coordinate( 3, -2, -2 )
                },
                {
                    "position": new Coordinate( 1, -2, 2 ),
                    "velocity": new Coordinate( -2, 5, 6 )
                },
                {
                    "position": new Coordinate( 1, -4, -1 ),
                    "velocity": new Coordinate( 0, 3, -6 )
                },
                {
                    "position": new Coordinate( 1, -4, 2 ),
                    "velocity": new Coordinate( -1, -6, 2 )
                },
            ]
        },
        {
            simulationStep: 3,
            bodies: [
                {
                    "position": new Coordinate( 5, -6, -1 ),
                    "velocity": new Coordinate( 0, -3, 0 )
                },
                {
                    "position": new Coordinate( 0, 0, 6 ),
                    "velocity": new Coordinate( -1, 2, 4 )
                },
                {
                    "position": new Coordinate( 2, 1, -5 ),
                    "velocity": new Coordinate( 1, 5, -4 )
                },
                {
                    "position": new Coordinate( 1, -8, 2 ),
                    "velocity": new Coordinate( 0, -4, 0 )
                },
            ]
        },
        {
            simulationStep: 4,
            bodies: [
                {
                    "position": new Coordinate( 2, -8, 0 ),
                    "velocity": new Coordinate( -3, -2, 1 )
                },
                {
                    "position": new Coordinate( 2, 1, 7 ),
                    "velocity": new Coordinate( 2, 1, 1 )
                },
                {
                    "position": new Coordinate( 2, 3, -6 ),
                    "velocity": new Coordinate( 0, 2, -1 )
                },
                {
                    "position": new Coordinate( 2, -9, 1 ),
                    "velocity": new Coordinate( 1, -1, -1 )
                },
            ]
        },
        {
            simulationStep: 5,
            bodies: [
                {
                    "position": new Coordinate( -1, -9, 2 ),
                    "velocity": new Coordinate( -3, -1, 2 )
                },
                {
                    "position": new Coordinate( 4, 1, 5 ),
                    "velocity": new Coordinate( 2, 0, -2 )
                },
                {
                    "position": new Coordinate( 2, 2, -4 ),
                    "velocity": new Coordinate( 0, -1, 2 )
                },
                {
                    "position": new Coordinate( 3, -7, -1 ),
                    "velocity": new Coordinate( 1, 2, -2 )
                },
            ]
        },
        {
            simulationStep: 6,
            bodies: [
                {
                    "position": new Coordinate( -1, -7, 3 ),
                    "velocity": new Coordinate( 0, 2, 1 )
                },
                {
                    "position": new Coordinate( 3, 0, 0 ),
                    "velocity": new Coordinate( -1, -1, -5 )
                },
                {
                    "position": new Coordinate( 3, -2, 1 ),
                    "velocity": new Coordinate( 1, -4, 5 )
                },
                {
                    "position": new Coordinate( 3, -4, -2 ),
                    "velocity": new Coordinate( 0, 3, -1 )
                },
            ]
        },
        {
            simulationStep: 7,
            bodies: [
                {
                    "position": new Coordinate( 2, -2, 1 ),
                    "velocity": new Coordinate( 3, 5, -2 )
                },
                {
                    "position": new Coordinate( 1, -4, -4 ),
                    "velocity": new Coordinate( -2, -4, -4 )
                },
                {
                    "position": new Coordinate( 3, -7, 5 ),
                    "velocity": new Coordinate( 0, -5, 4 )
                },
                {
                    "position": new Coordinate( 2, 0, 0 ),
                    "velocity": new Coordinate( -1, 4, 2 )
                },
            ]
        },
        {
            simulationStep: 8,
            bodies: [
                {
                    "position": new Coordinate( 5, 2, -2 ),
                    "velocity": new Coordinate( 3, 4, -3 )
                },
                {
                    "position": new Coordinate( 2, -7, -5 ),
                    "velocity": new Coordinate( 1, -3, -1 )
                },
                {
                    "position": new Coordinate( 0, -9, 6 ),
                    "velocity": new Coordinate( -3, -2, 1 )
                },
                {
                    "position": new Coordinate( 1, 1, 3 ),
                    "velocity": new Coordinate( -1, 1, 3 )
                },
            ]
        },
        {
            simulationStep: 9,
            bodies: [
                {
                    "position": new Coordinate( 5, 3, -4 ),
                    "velocity": new Coordinate( 0, 1, -2 )
                },
                {
                    "position": new Coordinate( 2, -9, -3 ),
                    "velocity": new Coordinate( 0, -2, 2 )
                },
                {
                    "position": new Coordinate( 0, -8, 4 ),
                    "velocity": new Coordinate( 0, 1, -2 )
                },
                {
                    "position": new Coordinate( 1, 1, 5 ),
                    "velocity": new Coordinate( 0, 0, 2 )
                },
            ]
        },
        {
            simulationStep: 10,
            bodies: [
                {
                    "position": new Coordinate( 2, 1, -3 ),
                    "velocity": new Coordinate( -3, -2, 1 )
                },
                {
                    "position": new Coordinate( 1, -8, 0 ),
                    "velocity": new Coordinate( -1, 1, 3 )
                },
                {
                    "position": new Coordinate( 3, -6, 1 ),
                    "velocity": new Coordinate( 3, 2, -3 )
                },
                {
                    "position": new Coordinate( 2, 0, 4 ),
                    "velocity": new Coordinate( 1, -1, -1 )
                }
            ]
        }
    ];

    const sim2InitialPositions: Vector[] = [
        [-8, -10, 0],
        [5, 5, 10],
        [2, -7, 3],
        [9, -8, -3]
    ];

    const sim2ExpectedResults: IGravTestData = [
        {
            simulationStep: 0,
            bodies: [
                { "position": new Coordinate( -8, -10, 0 ), "velocity": new Coordinate( 0, 0, 0 ) },
                { "position": new Coordinate( 5, 5, 10 ), "velocity": new Coordinate( 0, 0, 0 ) },
                { "position": new Coordinate( 2, -7, 3 ), "velocity": new Coordinate( 0, 0, 0 ) },
                { "position": new Coordinate( 9, -8, -3 ), "velocity": new Coordinate( 0, 0, 0 ) },
            ],
        },
        {
            simulationStep: 10,
            bodies: [
                { "position": new Coordinate( -9, 10, 1 ), "velocity": new Coordinate( -2, -2, -1 ) },
                { "position": new Coordinate( 4, 10, 9 ), "velocity": new Coordinate( -3, 7, -2 ) },
                { "position": new Coordinate( 8, 10, -3 ), "velocity": new Coordinate( 5, -1, -2 ) },
                { "position": new Coordinate( 5, 10, 3 ), "velocity": new Coordinate( 0, -4, 5 ) },
            ],
        },
        {
            simulationStep: 20,
            bodies: [
                { "position": new Coordinate( -10, 3, -4 ), "velocity": new Coordinate( -5, 2, 0 ) },
                { "position": new Coordinate( 5, 25, 6 ), "velocity": new Coordinate( 1, 1, -4 ) },
                { "position": new Coordinate( 13, 1, 1 ), "velocity": new Coordinate( 5, -2, 2 ) },
                { "position": new Coordinate( 0, 1, 7 ), "velocity": new Coordinate( -1, -1, 2 ) },
            ],
        },
        {
            simulationStep: 30,
            bodies: [
                {
                    "position": new Coordinate( 15, -6, -9 ), "velocity": new Coordinate( -5, 4, 0 )
                },
                { "position": new Coordinate( -4, 11, 3 ), "velocity": new Coordinate( -3, -10, 0 ) },
                { "position": new Coordinate( 0, -1, 11 ), "velocity": new Coordinate( 7, 4, 3 ) },
                { "position": new Coordinate( -3, -2, 5 ), "velocity": new Coordinate( 1, 2, -3 ) },
            ],
        },
        {
            simulationStep: 40,
            bodies: [
                {
                    "position": new Coordinate( 14, 12, -4 ), "velocity": new Coordinate( 11, 3, 0 )
                },
                { "position": new Coordinate( -1, 18, 8 ), "velocity": new Coordinate( -5, 2, 3 ) },
                { "position": new Coordinate( -5, 14, 8 ), "velocity": new Coordinate( 1, -2, 0 ) },
                { "position": new Coordinate( 0, 12, -2 ), "velocity": new Coordinate( -7, -3, -3 ) },
            ],
        },
        {
            simulationStep: 50,
            bodies: [
                { "position": new Coordinate( -23, 4, 1 ), "velocity": new Coordinate( -7, -1, 2 ) },
                { "position": new Coordinate( 20, 31, 13 ), "velocity": new Coordinate( 5, 3, 4 ) },
                { "position": new Coordinate( -4, 6, 1 ), "velocity": new Coordinate( -1, 1, -3 ) },
                { "position": new Coordinate( 15, 1, -5 ), "velocity": new Coordinate( 3, -3, -3 ) },
            ],
        },
        {
            simulationStep: 60,
            bodies: [
                { "position": new Coordinate( 36, 10, 6 ), "velocity": new Coordinate( 5, 0, 3 ) },
                { "position": new Coordinate( -18, 10, 9 ), "velocity": new Coordinate( -3, -7, 5 ) },
                { "position": new Coordinate( 8, 12, -3 ), "velocity": new Coordinate( -2, 1, -7 ) },
                { "position": new Coordinate( -18, -8, -2 ), "velocity": new Coordinate( 0, 6, -1 ) },
            ],
        },
        {
            simulationStep: 70,
            bodies: [
                { "position": new Coordinate( -33, -6, 5 ), "velocity": new Coordinate( -5, -4, 7 ) },
                { "position": new Coordinate( 13, -9, 2 ), "velocity": new Coordinate( -2, 11, 3 ) },
                { "position": new Coordinate( 11, -8, 2 ), "velocity": new Coordinate( 8, -6, -7 ) },
                { "position": new Coordinate( 17, 3, 1 ), "velocity": new Coordinate( -1, -1, -3 ) },
            ],
        },
        {
            simulationStep: 80,
            bodies: [
                { "position": new Coordinate( 30, -8, 3 ), "velocity": new Coordinate( 3, 3, 0 ) },
                { "position": new Coordinate( -2, -4, 0 ), "velocity": new Coordinate( 4, -13, 2 ) },
                { "position": new Coordinate( -18, -7, 15 ), "velocity": new Coordinate( -8, 2, -2 ) },
                { "position": new Coordinate( -2, -1, -8 ), "velocity": new Coordinate( 1, 8, 0 ) },
            ],
        },
        {
            simulationStep: 90,
            bodies: [
                { "position": new Coordinate( -25, -1, 4 ), "velocity": new Coordinate( 1, -3, 4 ) },
                { "position": new Coordinate( 2, -9, 0 ), "velocity": new Coordinate( -3, 13, -1 ) },
                { "position": new Coordinate( 32, -8, 14 ), "velocity": new Coordinate( 5, -4, 6 ) },
                { "position": new Coordinate( -1, -2, -8 ), "velocity": new Coordinate( -3, -6, -9 ) },
            ],
        },
        {
            simulationStep: 100,
            bodies: [
                { "position": new Coordinate( 8, 12, -9 ), "velocity": new Coordinate( -7, 3, 0 ) },
                { "position": new Coordinate( 13, 16, -3 ), "velocity": new Coordinate( 3, -11, -5 ) },
                { "position": new Coordinate( -29, 11, -1 ), "velocity": new Coordinate( -3, 7, 4 ) },
                { "position": new Coordinate( 16, 13, 23 ), "velocity": new Coordinate( 7, 1, 1 ) },
            ]
        },
    ];

    it( 'Constructs properly', () =>
    {
        const testSubject = new GravitySimulator( sim1InitialPositions );

        expect( testSubject.getPosition( 0 ).getId() ).to.equal( '-1,0,2' );
        expect( testSubject.getPosition( 1 ).getId() ).to.equal( '2,-10,-7' );
        expect( testSubject.getPosition( 2 ).getId() ).to.equal( '4,-8,8' )
        expect( testSubject.getPosition( 3 ).getId() ).to.equal( '3,5,-1' );

        expect( testSubject.getVelocity( 0 ).getId() ).to.equal( '0,0,0' );
        expect( testSubject.getVelocity( 1 ).getId() ).to.equal( '0,0,0' );
        expect( testSubject.getVelocity( 2 ).getId() ).to.equal( '0,0,0' );
        expect( testSubject.getVelocity( 3 ).getId() ).to.equal( '0,0,0' );
    } );

    it( 'Simulation 1 - 10 time steps', () =>
    {
        const testSubject = new GravitySimulator( sim1InitialPositions );
        simulatorTest( testSubject, sim1ExpectedResults, 179 );
    } );

    it( 'Simulation 2 - 100 time steps', () =>
    {
        const testSubject = new GravitySimulator( sim2InitialPositions );
        simulatorTest( testSubject, sim2ExpectedResults, 1940 );
    } );
} );