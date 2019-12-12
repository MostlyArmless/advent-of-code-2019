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

    SetParent( parent: TreeNode )
    {
        this.parent = parent;
    }

    CountAncestors(): number
    {
        if ( this.parent === null )
            return 0;
        else
            return this.parent.CountAncestors() + 1;
    }
}