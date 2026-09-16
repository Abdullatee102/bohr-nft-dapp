import { parseAbi } from 'viem';

// Full MyNFT ABI typed with viem parseAbi
export const MY_NFT_ABI = parseAbi([
  'function name() external view returns (string)',
  'function symbol() external view returns (string)',
  'function MAX_SUPPLY() external view returns (uint256)',
  'function mintPrice() external view returns (uint256)',
  'function totalMinted() external view returns (uint256)',
  'function totalSupply() external view returns (uint256)',
  'function owner() external view returns (address)',
  'function tokenURI(uint256 tokenId) external view returns (string)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function mint(address recipient, string calldata uri) external payable returns (uint256)',
  'function mintBatch(address recipient, uint256 count) external payable',
  'function ownerMint(address recipient, string calldata uri) external returns (uint256)',
  'function setMintPrice(uint256 newPrice) external',
  'function setBaseURI(string calldata newBaseURI) external',
  'function withdraw(address payable recipient) external',
  'event NFTMinted(address indexed recipient, uint256 indexed tokenId, string tokenURI)',
  'event MintPriceUpdated(uint256 oldPrice, uint256 newPrice)',
  'event BaseURIUpdated(string newBaseURI)',
  'event FundsWithdrawn(address indexed recipient, uint256 amount)'
]);

// Deployed MyNFT Contract Address on Bohr Testnet
export const DEFAULT_NFT_CONTRACT_ADDRESS: `0x${string}` =
  (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`) ||
  '0x59540a9B86c2bFB4F2591c840A6377484200d680';

export const BOHR_RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.bohr.life';

export const BOHR_EXPLORER_URL =
  process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://scan.bohr.life';

