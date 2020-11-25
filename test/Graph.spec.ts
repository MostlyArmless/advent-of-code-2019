// Test framework dependencies
const expect = require( 'chai' ).expect;
import * as chai from 'chai';
import { Graph } from '../src/Graph';
chai.use( require( 'chai-as-promised' ) ); // Extension that defines the "eventually" keyword
chai.use( require( 'chai-string' ) ); // Extension that provides the "string should contain" functionality

describe( 'Graph', () =>
{
    let graph: Graph<string, string>;

    beforeEach( () =>
    {
        graph = new Graph<string, string>();
    } );

    it( 'Add Node', () =>
    {
        const node = 'a';
        graph.addNode( node, 'dummyValue' );
        const allNodes = graph.getAllNodes();
        expect( allNodes.size ).to.equal( 1 );
        expect( allNodes ).to.have.all.keys( 'a' );
    } );

    it( 'Add Edge', () =>
    {
        graph.addEdge( 'a', 'b' );
        const allNodes = graph.getAllNodes();

        expect( allNodes.size ).to.equal( 2 );
        expect( allNodes ).to.have.all.keys( 'a', 'b' );

        const neighborsOfA = graph.getNodeNeighbors( 'a' );
        const neighborsOfB = graph.getNodeNeighbors( 'b' );
        expect( neighborsOfA ).to.have.all.keys( 'b' );
        expect( neighborsOfB ).to.have.all.keys( 'a' );
    } );

    it( 'Add Fully Connected Node', () =>
    {
        graph.addFullyConnectedNode( 'node1', 'val1' );
        graph.addFullyConnectedNode( 'node2', 'val2' );
        graph.addFullyConnectedNode( 'node3', 'val3' );

        expect( graph.adjacencyList.size ).to.equal( 3 );
        expect( graph.nodeValues.size ).to.equal( 3 );
        expect( graph.nodeValues ).to.have.all.keys( 'node1', 'node2', 'node3' );
    } );

    it( 'Delete edge', () =>
    {
        graph.addFullyConnectedNode( 'node1', 'val1' );
        graph.addFullyConnectedNode( 'node2', 'val2' );
        graph.addFullyConnectedNode( 'node3', 'val3' );
        graph.deleteEdge( 'node1', 'node3' );

        expect( graph.getNodeNeighbors( 'node1' ).has( 'node3' ) ).to.be.false;
        expect( graph.getNodeNeighbors( 'node1' ).has( 'node2' ) ).to.be.true;
        expect( graph.getNodeNeighbors( 'node2' ).has( 'node3' ) ).to.be.true;
        expect( graph.getNodeValue( 'node1' ) ).to.equal( 'val1' );
        expect( graph.getNodeValue( 'node2' ) ).to.equal( 'val2' );
        expect( graph.getNodeValue( 'node3' ) ).to.equal( 'val3' );
    } );
} );