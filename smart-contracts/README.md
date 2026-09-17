# Bohr Testnet Smart Contracts (Foundry)

This directory contains the Foundry-based smart contracts for the NFT Minting dApp configured for the **Bohr Testnet**.

## Network Details

- **Network Name**: Bohr Testnet
- **Chain ID**: `968`
- **RPC URL**: `https://rpc.bohr.life`
- **Native Currency**: `BOT` (18 Decimals)
- **Total Supply**: 150 Million
- **Block Explorer**: [https://scan.bohr.life/](https://scan.bohr.life/)

## Contract: `MyNFT.sol`

- **Compiler Version**: `pragma solidity 0.8.37;`
- **Standards**: ERC-721 (with `ERC721URIStorage`) and `Ownable` from OpenZeppelin Contracts v5.
- **Import Method**: Explicit relative path imports (`../lib/openzeppelin-contracts/...`).
- **Features**:
  - Max supply limit of 150,000,000 NFTs.
  - Native BOT payment handling with automatic excess BOT refunds.
  - Batch minting (`mintBatch`) and owner-only free minting (`ownerMint`).
  - Owner withdrawal mechanism to transfer accumulated BOT tokens.
  - Configurable mint price and base metadata URI.

## Prerequisites

- [Foundry](https://getfoundry.sh/) installed.

## Setup & Testing

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Build the contracts:
   ```bash
   forge build
   ```
3. Run unit tests with detailed traces:
   ```bash
   forge test -vvv
   ```

## Deployment to Bohr Testnet

Fill in your `PRIVATE_KEY` in `.env` and execute:

```bash
source .env
forge script script/MyNFT.s.sol:MyNFTScript \
  --rpc-url https://rpc.bohr.life \
  --broadcast \
  --legacy
```

_(Note: `--legacy` may be required if the EVM node expects legacy transactions instead of EIP-1559)_

### Existing deployment metadata

For the deployed contract, the owner must update the base URI once so batch mints and
tokens minted without an explicit URI resolve to the hosted BOT Genesis metadata:

```bash
cast send <CONTRACT_ADDRESS> "setBaseURI(string)" \
   "https://bohr-nft-dapp-lk9w.vercel.app/metadata/" \
   --rpc-url https://rpc.bohr.life \
   --private-key "$PRIVATE_KEY" \
   --legacy
```

Single mints from the frontend include their full metadata URI directly. The metadata
endpoint returns the collection JSON and the official card image at
`/bot-genesis-card.svg`.
