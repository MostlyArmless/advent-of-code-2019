import { TreeNode } from "./Tree";

interface OrbitalPair
{
    parent: string;
    child: string;
}

export class OrbitLengthChecker
{
    orbits: string[];
    tree: TreeNode;

    constructor( orbits: string[] )
    {
        this.orbits = orbits;
    }

    totalNumberOfOrbits(): number
    {
        this.buildOrbitTree();

        // Now that the tree exists, we can traverse it to count the number of orbits
        return null;
    }

    private buildOrbitTree(): void
    {
        this.orbits.forEach( orbit =>
        {
            let { parent, child } = this.parseOrbit( orbit );
            const parentNode = new TreeNode( parent );
            const childNode = new TreeNode( child );

            parentNode.AddChild( childNode );
        } );
    }

    private parseOrbit( orbit: string ): OrbitalPair
    {
        const planets = orbit.split( ')' );
        return {
            parent: planets[0],
            child: planets[1]
        };
    }
}