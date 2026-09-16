# Web3 NFT Minting dApp Monorepo (Bohr Testnet)

Production-ready Web3 monorepo for an ERC-721 NFT Minting dApp configured for the **Bohr Testnet**.

---

## Bohr Testnet Specifications

- **Chain ID**: `968`
- **RPC URL**: `https://rpc.bohr.life`
- **Native Currency**: `BOT` (Decimals: 18)
- **Total Supply**: 150 Million
- **Block Explorer**: [https://scan.bohr.life](https://scan.bohr.life)
- **Deployed Contract Address**: [`0x59540a9B86c2bFB4F2591c840A6377484200d680`](https://scan.bohr.life/address/0x59540a9B86c2bFB4F2591c840A6377484200d680)

---

## Monorepo Architecture

```
Web3_Nft_DApps/
├── smart-contracts/               # Foundry Smart Contract Suite
│   ├── src/
│   │   └── MyNFT.sol              # ERC721URIStorage + Ownable (pragma 0.8.37, relative imports)
│   ├── script/
│   │   └── MyNFT.s.sol            # Bohr Testnet deployment script
│   ├── test/
│   │   └── MyNFT.t.sol            # 13 comprehensive Foundry unit tests (all passing)
│   ├── lib/
│   │   ├── openzeppelin-contracts # OpenZeppelin Contracts v5 submodule
│   │   └── forge-std              # Foundry testing framework submodule
│   ├── foundry.toml               # Bohr RPC, chain ID 968, solc 0.8.37 configuration
│   ├── .env.example               # Template for deployment variables
│   └── .env                       # Deployment credentials (protected by .gitignore)
│
├── frontend/                      # Next.js 16 + Tailwind CSS Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx         # Root layout with Web3ContextProvider and Navbar
│   │   │   ├── page.tsx           # Production Minting dApp Landing Page
│   │   │   └── globals.css        # Tailwind styling & dark mode setup
│   │   ├── components/
│   │   │   ├── Navbar.tsx         # AppKit Connect Button, Network Indicator & Switcher
│   │   │   ├── MintCard.tsx       # Live Minting, Quantity, Price, BohrScan TX feedback
│   │   │   └── NFTDisplay.tsx     # Artwork showcase, collection specs, user token count
│   │   ├── config/
│   │   │   ├── chains.ts          # Bohr Testnet chain definition (Chain ID 968)
│   │   │   ├── contracts.ts       # Live contract address & Viem parseAbi definition
│   │   │   └── wagmi.ts           # WagmiAdapter & Reown AppKit configuration
│   │   └── context/
│   │       └── index.tsx          # Reown AppKit modal & Wagmi/TanStack Query providers
│   ├── .env.example               # Frontend environment template
│   └── .env.local                 # Local environment (safe, no private keys exposed)
│
└── README.md
```

---

## Smart Contract Details (`smart-contracts/`)

- **Solidity Version**: `0.8.37`
- **Imports**: Explicit relative paths to OpenZeppelin Contracts (`../lib/openzeppelin-contracts/...`).
- **Features**:
  - Max supply capped at 150,000,000.
  - Native BOT payment with automatic refund for any excess BOT sent.
  - Checks-Effects-Interactions (CEI) compliant reentrancy prevention.
  - Batch minting (`mintBatch`), single mint (`mint`), owner free mint (`ownerMint`).
  - Owner withdrawal for contract funds.

### Testing Contracts

```bash
cd smart-contracts
forge test -vvv
```

---

## Frontend dApp (`frontend/`)

- Built with **Next.js (App Router)** and **Tailwind CSS**.
- Powered by **Reown AppKit** (`@reown/appkit`, `@reown/appkit-adapter-wagmi`, `wagmi@2.x`, `viem`, `@tanstack/react-query`).
- Real-time interaction with the live contract deployed on Bohr Testnet.

### Running the Frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How to Test Live Minting with MetaMask

1. Add the **Bohr Testnet** to MetaMask:
   - **Network Name**: Bohr Testnet
   - **New RPC URL**: `https://rpc.bohr.life`
   - **Chain ID**: `968`
   - **Currency Symbol**: `BOT`
   - **Block Explorer URL**: `https://scan.bohr.life`
2. Connect your wallet using the **Connect Wallet** button in the header.
3. Select your desired mint quantity (1 - 10 NFTs).
4. Click **Mint NFT**:
   - MetaMask will prompt you to confirm the transaction with the required BOT fee (0.01 BOT per NFT).
   - Once confirmed, the dApp displays the live transaction hash with a direct link to view it on [BohrScan Explorer](https://scan.bohr.life).
