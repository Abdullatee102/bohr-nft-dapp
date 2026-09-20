// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

import "forge-std/Test.sol";
import "../src/MyNFT.sol";

/**
 * @title MyNFTTest
 * @dev Unit test suite for MyNFT contract on Bohr Testnet.
 */
contract MyNFTTest is Test {
    MyNFT public nft;

    address public owner = address(0xABCD);
    address public alice = address(0x1111);
    address public bob = address(0x2222);

    string constant NAME = "Bohr Genesis NFT";
    string constant SYMBOL = unicode"BG搏";
    string constant BASE_URI = "https://api.bohr.life/metadata/";

    event NFTMinted(address indexed recipient, uint256 indexed tokenId, string tokenURI);
    event MintPriceUpdated(uint256 oldPrice, uint256 newPrice);
    event BaseURIUpdated(string newBaseURI);
    event FundsWithdrawn(address indexed recipient, uint256 amount);

    function setUp() public {
        vm.deal(owner, 100 ether);
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);

        vm.prank(owner);
        nft = new MyNFT(NAME, SYMBOL, BASE_URI, owner);
    }

    function test_InitialConfiguration() public view {
        assertEq(nft.name(), NAME);
        assertEq(nft.symbol(), SYMBOL);
        assertEq(nft.owner(), owner);
        assertEq(nft.MAX_SUPPLY(), 150_000_000);
        assertEq(nft.mintPrice(), 0.01 ether);
        assertEq(nft.totalMinted(), 0);
        assertEq(nft.totalSupply(), 0);
    }

    function test_PublicMint_Success() public {
        vm.prank(alice);
        vm.expectEmit(true, true, false, true);
        emit NFTMinted(alice, 1, "ipfs://test-uri-1");

        uint256 tokenId = nft.mint{value: 0.01 ether}(alice, "ipfs://test-uri-1");

        assertEq(tokenId, 1);
        assertEq(nft.ownerOf(1), alice);
        assertEq(nft.tokenURI(1), "ipfs://test-uri-1");
        assertEq(nft.totalMinted(), 1);
        assertEq(address(nft).balance, 0.01 ether);
    }

    function test_PublicMint_BaseURI_Fallback() public {
        vm.prank(alice);
        uint256 tokenId = nft.mint{value: 0.01 ether}(alice, "");

        assertEq(tokenId, 1);
        assertEq(nft.ownerOf(1), alice);
        // Base URI + tokenId string
        assertEq(nft.tokenURI(1), string.concat(BASE_URI, "1"));
    }

    function test_PublicMint_RefundExcessBOT() public {
        uint256 aliceInitialBalance = alice.balance;

        vm.prank(alice);
        // Alice sends 0.05 BOT for a 0.01 BOT mint
        uint256 tokenId = nft.mint{value: 0.05 ether}(alice, "");

        assertEq(tokenId, 1);
        // Exactly 0.01 BOT should be spent, 0.04 BOT refunded
        assertEq(alice.balance, aliceInitialBalance - 0.01 ether);
        assertEq(address(nft).balance, 0.01 ether);
    }

    function test_PublicMint_RevertWhen_InsufficientPayment() public {
        vm.prank(alice);
        vm.expectRevert(
            abi.encodeWithSelector(MyNFT.InsufficientPayment.selector, 0.01 ether, 0.005 ether)
        );
        nft.mint{value: 0.005 ether}(alice, "");
    }

    function test_OwnerMint_Free() public {
        vm.prank(owner);
        uint256 tokenId = nft.ownerMint(bob, "ipfs://owner-minted");

        assertEq(tokenId, 1);
        assertEq(nft.ownerOf(1), bob);
        assertEq(nft.tokenURI(1), "ipfs://owner-minted");
        assertEq(nft.totalMinted(), 1);
    }

    function test_OwnerMint_RevertWhen_NotOwner() public {
        vm.prank(alice);
        vm.expectRevert(
            abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice)
        );
        nft.ownerMint(alice, "");
    }

    function test_MintBatch_Success() public {
        vm.prank(alice);
        nft.mintBatch{value: 0.03 ether}(alice, 3);

        assertEq(nft.totalMinted(), 3);
        assertEq(nft.ownerOf(1), alice);
        assertEq(nft.ownerOf(2), alice);
        assertEq(nft.ownerOf(3), alice);
    }

    function test_MintBatch_RevertWhen_InsufficientPayment() public {
        vm.prank(alice);
        vm.expectRevert(
            abi.encodeWithSelector(MyNFT.InsufficientPayment.selector, 0.03 ether, 0.02 ether)
        );
        nft.mintBatch{value: 0.02 ether}(alice, 3);
    }

    function test_Withdraw_Success() public {
        // Alice mints to deposit funds
        vm.prank(alice);
        nft.mint{value: 0.01 ether}(alice, "");

        assertEq(address(nft).balance, 0.01 ether);

        address payable treasury = payable(address(0x9999));
        uint256 treasuryInitial = treasury.balance;

        vm.prank(owner);
        vm.expectEmit(true, false, false, true);
        emit FundsWithdrawn(treasury, 0.01 ether);
        nft.withdraw(treasury);

        assertEq(address(nft).balance, 0);
        assertEq(treasury.balance, treasuryInitial + 0.01 ether);
    }

    function test_Withdraw_RevertWhen_NotOwner() public {
        vm.prank(alice);
        vm.expectRevert(
            abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice)
        );
        nft.withdraw(payable(alice));
    }

    function test_SetMintPrice_Success() public {
        vm.prank(owner);
        vm.expectEmit(false, false, false, true);
        emit MintPriceUpdated(0.01 ether, 0.05 ether);
        nft.setMintPrice(0.05 ether);

        assertEq(nft.mintPrice(), 0.05 ether);
    }

    function test_SetBaseURI_Success() public {
        string memory newURI = "https://ipfs.io/ipfs/bafytest/";
        vm.prank(owner);
        vm.expectEmit(false, false, false, true);
        emit BaseURIUpdated(newURI);
        nft.setBaseURI(newURI);

        vm.prank(alice);
        nft.mint{value: 0.01 ether}(alice, "");
        assertEq(nft.tokenURI(1), string.concat(newURI, "1"));
    }

    function test_TransferFrom_Success() public {
        vm.prank(alice);
        uint256 tokenId = nft.mint{value: 0.01 ether}(alice, "");

        assertEq(nft.ownerOf(tokenId), alice);
        assertEq(nft.balanceOf(alice), 1);
        assertEq(nft.balanceOf(bob), 0);

        // Alice transfers the NFT directly to Bob
        vm.prank(alice);
        nft.transferFrom(alice, bob, tokenId);

        assertEq(nft.ownerOf(tokenId), bob);
        assertEq(nft.balanceOf(alice), 0);
        assertEq(nft.balanceOf(bob), 1);
    }

    function test_SafeTransferFrom_Success() public {
        vm.prank(alice);
        uint256 tokenId = nft.mint{value: 0.01 ether}(alice, "");

        // Alice safely transfers to Bob
        vm.prank(alice);
        nft.safeTransferFrom(alice, bob, tokenId);

        assertEq(nft.ownerOf(tokenId), bob);
        assertEq(nft.balanceOf(alice), 0);
        assertEq(nft.balanceOf(bob), 1);
    }

    function test_ApproveAndTransfer_Success() public {
        vm.prank(alice);
        uint256 tokenId = nft.mint{value: 0.01 ether}(alice, "");

        // Alice approves Bob or a marketplace operator
        vm.prank(alice);
        nft.approve(bob, tokenId);
        assertEq(nft.getApproved(tokenId), bob);

        // Bob transfers on Alice's behalf
        vm.prank(bob);
        nft.transferFrom(alice, bob, tokenId);

        assertEq(nft.ownerOf(tokenId), bob);
        assertEq(nft.getApproved(tokenId), address(0));
    }
}
