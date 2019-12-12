export class TreeNode
{
    name: string;
    descendents: TreeNode[];
    parent: TreeNode;

    constructor( nodeName: string )
    {
        this.name = nodeName;
        this.descendents = [];
        this.parent = null;
    }

    AddChild( child: TreeNode )
    {
        this.descendents.push( child );
        child.parent = this;
    }

    GetDistanceToRootNode(): number
    {
        if ( this.parent === null )
            return 0;
        else
            return this.parent.GetDistanceToRootNode() + 1;
    }

    GetChildren(): TreeNode[]
    {
        return this.descendents;
    }

    GetAllLeafNodes( leafNodes?: Set<TreeNode> ): Set<TreeNode>
    {
        if ( !leafNodes )
            leafNodes = new Set<TreeNode>();

        if ( this.descendents.length === 0 && this.parent !== null )
        {
            // This is a leaf node (Dosn't count the root node as a leaf, even if it has zero children)
            leafNodes.add( this );
        }
        else
        {
            this.descendents.forEach( child =>
            {
                leafNodes = child.GetAllLeafNodes( leafNodes );
            } );
        }

        return leafNodes;
    }

    GetSumOfAllNodeToRootDistances( sum?: number ): number
    {
        if ( !sum )
            sum = 0;

        if ( this.descendents.length === 0 )
        {
            // Leaf node
            return this.GetDistanceToRootNode();
        }
        else
        {
            // Count your own distance
            sum += this.GetDistanceToRootNode();

            // And the distances of all your children
            this.descendents.forEach( child =>
            {
                sum += child.GetSumOfAllNodeToRootDistances();
            } );

            return sum;
        }
    }
}