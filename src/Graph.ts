export class Graph<K, V>
{
    adjacencyList: Map<K, Set<K>>;
    nodeValues: Map<K, V>;
    constructor()
    {
        this.adjacencyList = new Map<K, Set<K>>();
        this.nodeValues = new Map<K, V>();
    }

    addNode( nodeName: K, nodeValue: V ): void
    {
        if ( this.adjacencyList.has( nodeName ) )
            return;

        this.adjacencyList.set( nodeName, new Set<K>() );
        this.nodeValues.set( nodeName, nodeValue );
    }

    getNodeValue( nodeName: K ): V
    {
        return this.nodeValues.get( nodeName );
    }

    getNodeNeighbors( nodeName: K ): Set<K>
    {
        let neighborNames = this.adjacencyList.get( nodeName );
        if ( neighborNames === undefined )
        {
            this.addNode( nodeName, null );
            neighborNames = this.adjacencyList.get( nodeName );
        }

        return neighborNames;
    }

    getNodeNeighborsWithValues( nodeName: K ): Map<K, V>
    {
        const neighborNames = this.getNodeNeighbors( nodeName );

        let neighbors = new Map<K, V>();
        neighborNames.forEach( node =>
        {
            neighbors.set( node, this.nodeValues.get( node ) );
        } );

        return neighbors;
    }

    addEdge( nodeA: K, nodeB: K ): void
    {
        if ( nodeA === nodeB )
            return; // Don't allow edges between a node and itself, makes no sense.

        let neighborsOfA = this.getNodeNeighbors( nodeA );
        neighborsOfA.add( nodeB );
        this.adjacencyList.set( nodeA, neighborsOfA );

        let neighborsOfB = this.getNodeNeighbors( nodeB );
        neighborsOfB.add( nodeA );
        this.adjacencyList.set( nodeB, neighborsOfB );
    }

    getAllNodes(): Map<K, V>
    {
        return this.nodeValues;
    }

    addFullyConnectedNode( nodeName: K, nodeValue: V ): void
    {
        // Add a new node with edges between it and all existing vertices
        this.addNode( nodeName, nodeValue );
        this.nodeValues.forEach( ( value, existingNodeName ) =>
        {
            if ( nodeName === existingNodeName )
                return; // Don't allow a node to list itself as a connection, makes no sense

            this.addEdge( existingNodeName, nodeName );
        } );
    }

    deleteEdge( nodeA: K, nodeB: K ): void
    {
        let neighborsOfA = this.adjacencyList.get( nodeA );
        neighborsOfA.delete( nodeB );

        let neighborsOfB = this.adjacencyList.get( nodeB );
        neighborsOfB.delete( nodeA );
    }

    printAdjacencies(): void
    {
        this.adjacencyList.forEach( ( value, key ) =>
        {
            const neighbors = Array.from( value ).join( ', ' );
            console.log( `Node "${key}" neighbors = ${neighbors}` );
        } );
    }

    hasNode( nodeName: K ): boolean
    {
        return this.adjacencyList.has( nodeName );
    }
}