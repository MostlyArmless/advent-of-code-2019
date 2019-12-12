export class TreeNode
{
    name: string;
    immediateChildren: Set<TreeNode>;
    parent: TreeNode;

    constructor( nodeName: string )
    {
        this.name = nodeName;
        this.immediateChildren = new Set<TreeNode>();
        this.parent = null;
    }

    AddChild( child: TreeNode )
    {
        this.immediateChildren.add( child );
        child.parent = this;
    }

    GetDistanceToRootNode(): number
    {
        if ( this.parent === null )
            return 0;
        else
            return this.parent.GetDistanceToRootNode() + 1;
    }

    GetChildren(): Set<TreeNode>
    {
        return this.immediateChildren;
    }

    getParent(): TreeNode
    {
        return this.parent;
    }

    GetAllLeafNodes( leafNodes?: Set<TreeNode> ): Set<TreeNode>
    {
        if ( !leafNodes )
            leafNodes = new Set<TreeNode>();

        if ( this.immediateChildren.size === 0 && this.parent !== null )
        {
            // This is a leaf node (Dosn't count the root node as a leaf, even if it has zero children)
            leafNodes.add( this );
        }
        else
        {
            this.immediateChildren.forEach( child =>
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

        if ( this.immediateChildren.size === 0 )
        {
            // Leaf node
            return this.GetDistanceToRootNode();
        }
        else
        {
            // Count your own distance
            sum += this.GetDistanceToRootNode();

            // And the distances of all your children
            this.immediateChildren.forEach( child =>
            {
                sum += child.GetSumOfAllNodeToRootDistances();
            } );

            return sum;
        }
    }

    GetNearestCommonAncestor( nodeA: TreeNode, nodeB: TreeNode ): TreeNode | null
    {
        // ASSUMPTIONS:
        // 1. neither nodeA or nodeB is root
        // 2. nodeA and nodeB are not descendents of one another (i.e. their common ancestor is NOT one of nodeA, nodeB)
        // 3. A common ancestor is guaranteed to exist (the nodes are on the same tree)

        let ancestorA = nodeA;
        while ( !ancestorA.HasDescendant( nodeB ) )
        {
            ancestorA = ancestorA.getParent();
        }
        return ancestorA;
    }

    // getDistanceToTargetAncestorRecursive( targetAncestor: TreeNode ): number | null
    // {
    //     if ( this.parent === null )
    //         return null;

    //     if ( this === targetAncestor )
    //         return 0;
    //     else
    //         return this.parent.getDistanceToTargetAncestorRecursive( targetAncestor ) + 1;
    // }

    getDistanceToTargetAncestor( targetAncestor: TreeNode ): number | null
    {
        if ( this === targetAncestor )
            return 0;


        let ancestor = this.getParent();
        let distance = 1;

        while ( ancestor !== targetAncestor )
        {
            ancestor = ancestor.getParent();
            distance += 1;

            if ( ancestor === null )
                return null; // targetAncestor is NOT actually an ancestor of this node
        }

        return distance;
    }

    HasDescendant( node: TreeNode ): boolean
    {
        if ( this.immediateChildren.size === 0 )
            return false;

        if ( this.immediateChildren.has( node ) )
        {
            return true;
        }
        else
        {
            let anyHasDescendent = false;

            this.immediateChildren.forEach( child =>
            {
                anyHasDescendent = anyHasDescendent || child.HasDescendant( node );

                if ( anyHasDescendent )
                    return true; // Early return if we found it
            } );

            return anyHasDescendent;
        }
    }
}