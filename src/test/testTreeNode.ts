import { TreeNode } from "../Tree";

// Test framework dependencies
const expect = require( 'chai' ).expect;

describe( 'TreeNode', () =>
{
    let m_testSubject: TreeNode;

    beforeEach( () =>
    {
        m_testSubject = new TreeNode( 'root' );
    } );

    it( 'No children on init', () =>
    {
        expect( m_testSubject.GetChildren() ).to.eql( [] );
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
