// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

import "forge-std/Script.sol";
import "../src/MyNFT.sol";

/**
 * @title MyNFTScript
 * @dev Deployment script for MyNFT on Bohr Testnet.
 * Chain ID: 968
 * RPC URL: https://rpc.bohr.life
 * Native Token: BOT
 * Explorer: https://scan.bohr.life/
 */
contract MyNFTScript is Script {
    function setUp() public {}

    function run() external returns (MyNFT) {
        uint256 deployerPrivateKey;
        address deployer;

        // Try reading PRIVATE_KEY from environment
        try vm.envUint("PRIVATE_KEY") returns (uint256 pk) {
            deployerPrivateKey = pk;
            deployer = vm.addr(pk);
        } catch {
            deployer = msg.sender;
        }

        console.log("----------------------------------------------");
        console.log("Deploying MyNFT to Bohr Testnet (Chain ID: 968)");
        console.log("Deployer Address:", deployer);
        console.log("Deployer Balance (BOT):", deployer.balance);

        string memory name = vm.envOr("NFT_NAME", string("Bohr Genesis NFT"));
        string memory symbol = vm.envOr("NFT_SYMBOL", string(unicode"BG搏"));
        string memory baseURI = vm.envOr(
            "NFT_BASE_URI",
            string("https://bohr-nft-dapp-lk9w.vercel.app/metadata/")
        );

        if (deployerPrivateKey != 0) {
            vm.startBroadcast(deployerPrivateKey);
        } else {
            vm.startBroadcast();
        }

        MyNFT nft = new MyNFT(name, symbol, baseURI, deployer);

        vm.stopBroadcast();

        console.log("----------------------------------------------");
        console.log("MyNFT Deployed Successfully!");
        console.log("Contract Address:", address(nft));
        console.log("Explorer Link: https://scan.bohr.life/address/", address(nft));
        console.log("Max Supply:", nft.MAX_SUPPLY());
        console.log("Mint Price (BOT):", nft.mintPrice());
        console.log("----------------------------------------------");

        return nft;
    }
}
