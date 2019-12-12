import { TreeNode } from "./Tree";

interface OrbitalPair
{
    parentName: string;
    childName: string;
}

export class OrbitLengthChecker
{
    orbits: string[];
    tree: TreeNode;
    createdNodes: Map<string, TreeNode>;
    leaves: TreeNode[];

    constructor( orbits: string[] )
    {
        this.orbits = orbits;
        this.tree = new TreeNode( "" );
        this.createdNodes = new Map<string, TreeNode>();
        this.leaves = [];

        this.buildOrbitTree();
    }

    getTree(): TreeNode
    {
        return this.tree;
    }

    totalNumberOfOrbits(): number
    {
        // this.leaves = Array.from( this.tree.GetAllLeafNodes() );

        // // Now that the tree exists, we can traverse it to count the number of orbits
        // const leafNodes = this.tree.GetAllLeafNodes();

        // let sumOfLeafToRootDistances = 0;
        // leafNodes.forEach( leaf =>
        // {
        //     sumOfLeafToRootDistances += leaf.GetDistanceToRootNode();
        // } );
        // 
        // return sumOfLeafToRootDistances;

        return this.tree.GetSumOfAllNodeToRootDistances();
    }

    private buildOrbitTree(): void
    {
        this.orbits.forEach( orbit =>
        {
            // Parse the text into parent and child names
            let { parentName, childName } = this.parseOrbit( orbit );
            let parentNode: TreeNode;
            let childNode: TreeNode;

            // Check to see if the parent already exists
            if ( this.createdNodes.has( parentName ) )
            {
                // The parent already exists
                if ( this.createdNodes.has( childName ) )
                {
                    // The parent and child both already exist, we just have to hook them together
                    const parentNode = this.createdNodes.get( parentName );
                    const childNode = this.createdNodes.get( childName );
                    parentNode.AddChild( childNode );
                }
                else
                {
                    // The child is new, parent is not
                    parentNode = this.createdNodes.get( parentName );
                    const childNode = new TreeNode( childName );
                    parentNode.AddChild( childNode );
                    this.createdNodes.set( childName, childNode );
                }
            }
            else
            {
                // Parent is new
                if ( this.createdNodes.has( childName ) )
                {
                    // Child exists
                    parentNode = new TreeNode( parentName );
                    childNode = this.createdNodes.get( childName );
                    parentNode.AddChild( childNode );
                    this.createdNodes.set( parentName, parentNode );
                }
                else
                {
                    // Parent AND child are new
                    parentNode = new TreeNode( parentName );
                    childNode = new TreeNode( childName );
                    parentNode.AddChild( childNode );
                    this.createdNodes.set( parentName, parentNode );
                    this.createdNodes.set( childName, childNode );
                }
            }

            if ( parentName === "COM" )
            {
                this.tree = parentNode;
            }
            else if ( childName === "COM" )
            {
                throw new Error( "COM is not supposed to have any parents!" );
            }
        } );
    }

    private parseOrbit( orbit: string ): OrbitalPair
    {
        const planets = orbit.split( ')' );
        return {
            parentName: planets[0],
            childName: planets[1]
        };
    }
}