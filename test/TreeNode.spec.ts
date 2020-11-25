import { TreeNode } from "../src/TreeNode";

// Test framework dependencies
const expect = require( 'chai' ).expect;

describe( 'TreeNode', () =>
{
    let m_testSubject: TreeNode;

    beforeEach( () =>
    {
        m_testSubject = new TreeNode( 'root' );
    } );

    describe( 'Basic Tests', () =>
    {
        it( 'No children on init', () =>
        {
            expect( m_testSubject.GetChildren().size ).to.equal( 0 );
        } );

        it( 'No leaf nodes on init', () =>
        {
            expect( m_testSubject.GetAllLeafNodes().size ).to.equal( 0 );
        } );

        it( 'Distance from root to root is 0', () =>
        {
            expect( m_testSubject.GetDistanceToRootNode() ).to.equal( 0 );
        } );

        it( 'Distance from level 1 child to root is 0', () =>
        {
            const child = new TreeNode( 'child' );
            m_testSubject.AddChild( child );
            expect( child.GetDistanceToRootNode() ).to.equal( 1 );
            expect( m_testSubject.GetDistanceToRootNode() ).to.equal( 0 );
        } );
    } );

    describe( 'Get all leaf nodes', () =>
    {
        it( 'Get all leaf nodes with one layer of children', () =>
        {
            const childA = new TreeNode( 'childA' );
            const childB = new TreeNode( 'childB' );
            m_testSubject.AddChild( childA );
            m_testSubject.AddChild( childB );
            const leafNodes = m_testSubject.GetAllLeafNodes();
            expect( leafNodes.size ).to.equal( 2 );
            expect( leafNodes.has( childA ) );
            expect( leafNodes.has( childB ) );
        } );

        it( 'Get all leaf nodes with two layers of children', () =>
        {
            const childA = new TreeNode( 'childA' );
            const childB = new TreeNode( 'childB' );
            const childC = new TreeNode( 'childC' ); // Leaf

            const grandchildA1 = new TreeNode( 'gca1' ); // Leaf
            const grandchildA2 = new TreeNode( 'gca2' ); // Leaf
            const grandchildB1 = new TreeNode( 'gcb1' ); // Leaf

            m_testSubject.AddChild( childA );
            m_testSubject.AddChild( childB );
            m_testSubject.AddChild( childC );

            childA.AddChild( grandchildA1 );
            childA.AddChild( grandchildA2 );
            childB.AddChild( grandchildB1 );

            const leafNodes = m_testSubject.GetAllLeafNodes();
            expect( leafNodes.size ).to.equal( 4 );
            expect( leafNodes.has( childC ) );
            expect( leafNodes.has( grandchildA1 ) );
            expect( leafNodes.has( grandchildA2 ) );
            expect( leafNodes.has( grandchildB1 ) );
        } );
    } );

    describe( 'Get distance to root node', () =>
    {
        it( 'Get distance to root from root is 0 in a populated tree structure', () =>
        {
            const childA = new TreeNode( 'childA' );
            const childB = new TreeNode( 'childB' );
            const childC = new TreeNode( 'childC' ); // Leaf

            const grandchildA1 = new TreeNode( 'gca1' ); // Leaf
            const grandchildA2 = new TreeNode( 'gca2' ); // Leaf
            const grandchildB1 = new TreeNode( 'gcb1' ); // Leaf

            m_testSubject.AddChild( childA );
            m_testSubject.AddChild( childB );
            m_testSubject.AddChild( childC );

            childA.AddChild( grandchildA1 );
            childA.AddChild( grandchildA2 );
            childB.AddChild( grandchildB1 );

            expect( m_testSubject.GetDistanceToRootNode() ).to.equal( 0 );
        } );

        it( 'Get distance to root from child is 1 in a populated tree structure', () =>
        {
            const childA = new TreeNode( 'childA' );
            const childB = new TreeNode( 'childB' );
            const childC = new TreeNode( 'childC' ); // Leaf

            const grandchildA1 = new TreeNode( 'gca1' ); // Leaf
            const grandchildA2 = new TreeNode( 'gca2' ); // Leaf
            const grandchildB1 = new TreeNode( 'gcb1' ); // Leaf

            m_testSubject.AddChild( childA );
            m_testSubject.AddChild( childB );
            m_testSubject.AddChild( childC );

            childA.AddChild( grandchildA1 );
            childA.AddChild( grandchildA2 );
            childB.AddChild( grandchildB1 );

            expect( childA.GetDistanceToRootNode() ).to.equal( 1 );
            expect( childB.GetDistanceToRootNode() ).to.equal( 1 );
            expect( childC.GetDistanceToRootNode() ).to.equal( 1 );
        } );

        it( 'Get distance to root from grandchild is 2 in a populated tree structure', () =>
        {
            const childA = new TreeNode( 'childA' );
            const childB = new TreeNode( 'childB' );
            const childC = new TreeNode( 'childC' ); // Leaf

            const grandchildA1 = new TreeNode( 'gca1' ); // Leaf
            const grandchildA2 = new TreeNode( 'gca2' ); // Leaf
            const grandchildB1 = new TreeNode( 'gcb1' ); // Leaf

            m_testSubject.AddChild( childA );
            m_testSubject.AddChild( childB );
            m_testSubject.AddChild( childC );

            childA.AddChild( grandchildA1 );
            childA.AddChild( grandchildA2 );
            childB.AddChild( grandchildB1 );

            expect( grandchildA1.GetDistanceToRootNode() ).to.equal( 2 );
            expect( grandchildA2.GetDistanceToRootNode() ).to.equal( 2 );
            expect( grandchildB1.GetDistanceToRootNode() ).to.equal( 2 );
        } );
    } );

    describe( 'Get distance to target ancestor', () =>
    {
        it( 'Get distance to target ancestor from grandchild is 2 in a populated tree structure', () =>
        {
            const childA = new TreeNode( 'childA' );
            const childB = new TreeNode( 'childB' );
            const childC = new TreeNode( 'childC' ); // Leaf

            const grandchildA1 = new TreeNode( 'gca1' ); // Leaf
            const grandchildA2 = new TreeNode( 'gca2' ); // Leaf
            const grandchildB1 = new TreeNode( 'gcb1' ); // Leaf

            m_testSubject.AddChild( childA );
            m_testSubject.AddChild( childB );
            m_testSubject.AddChild( childC );

            childA.AddChild( grandchildA1 );
            childA.AddChild( grandchildA2 );
            childB.AddChild( grandchildB1 );

            expect( grandchildA1.getDistanceToTargetAncestor( m_testSubject ) ).to.equal( 2 );
            expect( grandchildA2.getDistanceToTargetAncestor( m_testSubject ) ).to.equal( 2 );
            expect( grandchildB1.getDistanceToTargetAncestor( m_testSubject ) ).to.equal( 2 );
        } );
    } );

    describe( 'Has Descendant', () =>
    {
        it( 'True for immediate child', () =>
        {
            const childA = new TreeNode( 'childA' );
            const childB = new TreeNode( 'childB' );
            const childC = new TreeNode( 'childC' ); // Leaf

            const grandchildA1 = new TreeNode( 'gca1' ); // Leaf
            const grandchildA2 = new TreeNode( 'gca2' ); // Leaf
            const grandchildB1 = new TreeNode( 'gcb1' ); // Leaf

            m_testSubject.AddChild( childA );
            m_testSubject.AddChild( childB );
            m_testSubject.AddChild( childC );

            childA.AddChild( grandchildA1 );
            childA.AddChild( grandchildA2 );
            childB.AddChild( grandchildB1 );

            expect( m_testSubject.HasDescendant( childA ) ).to.be.true;
            expect( m_testSubject.HasDescendant( childB ) ).to.be.true;
            expect( m_testSubject.HasDescendant( childC ) ).to.be.true;
        } );

        it( 'True for grandchild', () =>
        {
            const childA = new TreeNode( 'childA' );
            const childB = new TreeNode( 'childB' );
            const childC = new TreeNode( 'childC' ); // Leaf

            const grandchildA1 = new TreeNode( 'gca1' ); // Leaf
            const grandchildA2 = new TreeNode( 'gca2' ); // Leaf
            const grandchildB1 = new TreeNode( 'gcb1' ); // Leaf

            m_testSubject.AddChild( childA );
            m_testSubject.AddChild( childB );
            m_testSubject.AddChild( childC );

            childA.AddChild( grandchildA1 );
            childA.AddChild( grandchildA2 );
            childB.AddChild( grandchildB1 );

            expect( m_testSubject.HasDescendant( grandchildA1 ) ).to.be.true;
            expect( m_testSubject.HasDescendant( grandchildA2 ) ).to.be.true;
            expect( m_testSubject.HasDescendant( grandchildB1 ) ).to.be.true;
        } );

        it( 'False for unrelated node', () =>
        {
            const childA = new TreeNode( 'childA' );
            const childB = new TreeNode( 'childB' );
            const childC = new TreeNode( 'childC' ); // Leaf

            const grandchildA1 = new TreeNode( 'gca1' ); // Leaf
            const grandchildA2 = new TreeNode( 'gca2' ); // Leaf
            const grandchildB1 = new TreeNode( 'gcb1' ); // Leaf

            const unrelatedNode = new TreeNode( 'other' );

            m_testSubject.AddChild( childA );
            m_testSubject.AddChild( childB );
            m_testSubject.AddChild( childC );

            childA.AddChild( grandchildA1 );
            childA.AddChild( grandchildA2 );
            childB.AddChild( grandchildB1 );

            expect( m_testSubject.HasDescendant( unrelatedNode ) ).to.be.false;
        } );

        it( 'False for ancestor node', () =>
        {
            const childA = new TreeNode( 'childA' );
            const childB = new TreeNode( 'childB' );
            const childC = new TreeNode( 'childC' ); // Leaf

            const grandchildA1 = new TreeNode( 'gca1' ); // Leaf
            const grandchildA2 = new TreeNode( 'gca2' ); // Leaf
            const grandchildB1 = new TreeNode( 'gcb1' ); // Leaf

            m_testSubject.AddChild( childA );
            m_testSubject.AddChild( childB );
            m_testSubject.AddChild( childC );

            childA.AddChild( grandchildA1 );
            childA.AddChild( grandchildA2 );
            childB.AddChild( grandchildB1 );

            expect( grandchildA1.HasDescendant( grandchildA2 ) ).to.be.false;
        } );

        it( 'False for sibling node', () =>
        {
            const childA = new TreeNode( 'childA' );
            const childB = new TreeNode( 'childB' );
            const childC = new TreeNode( 'childC' ); // Leaf

            const grandchildA1 = new TreeNode( 'gca1' ); // Leaf
            const grandchildA2 = new TreeNode( 'gca2' ); // Leaf
            const grandchildB1 = new TreeNode( 'gcb1' ); // Leaf

            m_testSubject.AddChild( childA );
            m_testSubject.AddChild( childB );
            m_testSubject.AddChild( childC );

            childA.AddChild( grandchildA1 );
            childA.AddChild( grandchildA2 );
            childB.AddChild( grandchildB1 );

            expect( childA.HasDescendant( childB ) ).to.be.false;
        } );
    } );

} );
