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
  'event FundsWithdrawn(address indexed recipient, uint256 amount)',
]);

// Deployed MyNFT Contract Address on Bohr Testnet
export const DEFAULT_NFT_CONTRACT_ADDRESS: `0x${string}` =
  (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`) ||
  '0x59540a9B86c2bFB4F2591c840A6377484200d680';

export const BOHR_RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL ||
  'https://rpc.bohr.life';

export const BOHR_EXPLORER_URL =
  process.env.NEXT_PUBLIC_EXPLORER_URL ||
  'https://scan.bohr.life';

export const NFT_METADATA_BASE_URI =
  process.env.NEXT_PUBLIC_METADATA_BASE_URI ||
  'https://bohr-nft-dapp-lk9w.vercel.app/metadata/';

/**
 * Resolves any tokenURI returned by the contract
 * to a fetchable HTTP metadata URL.
 *
 * Handles:
 * - Empty token URI
 * - Metadata base URI
 * - Legacy placeholder URIs
 * - Standard IPFS URIs
 * - Normal HTTP/HTTPS URIs
 */
export function resolveMetadataUrl(
  uri?: string,
  tokenId?: number | bigint | string
): string {
  const fallbackId = tokenId ? String(tokenId) : '1';

  const metadataBase = NFT_METADATA_BASE_URI.replace(/\/+$/, '');

  // Empty URI → use the configured metadata endpoint.
  if (!uri || uri.trim() === '') {
    return `${metadataBase}/${fallbackId}`;
  }

  const trimmed = uri.trim();

  /**
   * Legacy placeholder from earlier minting trials:
   * ipfs://bohr-nft/{id}.json
   */
  if (trimmed.startsWith('ipfs://bohr-nft/')) {
    const id = trimmed
      .replace('ipfs://bohr-nft/', '')
      .replace(/\.json$/i, '');

    return `${metadataBase}/${id || fallbackId}`;
  }

  // Standard IPFS URI → public IPFS gateway.
  if (trimmed.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${trimmed.replace(
      'ipfs://',
      ''
    )}`;
  }

  // Already a normal HTTP/HTTPS URL.
  return trimmed;
}

/**
 * Resolves an image URL extracted from metadata JSON.
 *
 * Handles:
 * - Empty image URI
 * - IPFS images
 * - Absolute HTTP/HTTPS images
 * - Root-relative application images
 */
export function resolveImageUrl(imageUrl?: string): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return '/bot-genesis-card.svg';
  }

  const trimmed = imageUrl.trim();

  // Standard IPFS URI → public IPFS gateway.
  if (trimmed.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${trimmed.replace(
      'ipfs://',
      ''
    )}`;
  }

  return trimmed;
}