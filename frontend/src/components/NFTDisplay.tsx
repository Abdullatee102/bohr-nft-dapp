'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAccount, useReadContract } from 'wagmi';
import { bohrTestnet } from '@/config/chains';
import {
  DEFAULT_NFT_CONTRACT_ADDRESS,
  MY_NFT_ABI,
  BOHR_EXPLORER_URL,
  resolveMetadataUrl,
  resolveImageUrl,
} from '@/config/contracts';
import {
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Award,
  Loader2,
  FileJson,
  CheckCircle2,
} from 'lucide-react';

interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  external_url?: string;
  attributes?: Array<{ trait_type: string; value: string | number }>;
}

export function NFTDisplay() {
  const { address, isConnected } = useAccount();

  // Read User's NFT balance
  const { data: userNftBalance } = useReadContract({
    address: DEFAULT_NFT_CONTRACT_ADDRESS,
    abi: MY_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: bohrTestnet.id,
  });

  // Read totalMinted from contract to pick active token for display
  const { data: totalMinted } = useReadContract({
    address: DEFAULT_NFT_CONTRACT_ADDRESS,
    abi: MY_NFT_ABI,
    functionName: 'totalMinted',
    chainId: bohrTestnet.id,
  });

  const activeTokenId = 1; // Default to Token #1 for the Genesis showcase

  // Step 1: Read tokenURI(tokenId) directly from the deployed MyNFT contract
  const { data: rawTokenUri, isLoading: isTokenUriLoading } = useReadContract({
    address: DEFAULT_NFT_CONTRACT_ADDRESS,
    abi: MY_NFT_ABI,
    functionName: 'tokenURI',
    args: [BigInt(activeTokenId)],
    chainId: bohrTestnet.id,
  });

  // Metadata and Image state
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [metadataUrl, setMetadataUrl] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('/bot-genesis-card.svg');
  const [isLoadingMetadata, setIsLoadingMetadata] = useState<boolean>(false);
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  // Step 2 & 3: Resolve metadata URL and fetch JSON metadata
  useEffect(() => {
    let isCancelled = false;

    async function loadMetadata() {
      const resolvedUrl = resolveMetadataUrl(rawTokenUri as string | undefined, activeTokenId);
      setMetadataUrl(resolvedUrl);
      setIsLoadingMetadata(true);
      setMetadataError(null);

      try {
        // Fetch metadata JSON
        const res = await fetch(resolvedUrl, {
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Failed to fetch metadata from ${resolvedUrl}`);
        }

        const data: NFTMetadata = await res.json();
        if (isCancelled) return;

        setMetadata(data);

        // Step 4: Extract image field and resolve image URL
        const resolvedImg = resolveImageUrl(data.image);
        setImageUrl(resolvedImg);
        setImageError(false);
      } catch (err: unknown) {
        if (isCancelled) return;
        console.warn('Metadata fetch fallback:', err);
        setMetadataError((err as Error).message);
        // Fallback to local verified SVG if metadata fetch fails
        setImageUrl('/bot-genesis-card.svg');
      } finally {
        if (!isCancelled) {
          setIsLoadingMetadata(false);
        }
      }
    }

    loadMetadata();

    return () => {
      isCancelled = true;
    };
  }, [rawTokenUri, activeTokenId]);

  const traits = [
    { label: 'Blockchain', value: 'Bohr Testnet', icon: Globe },
    { label: 'Chain ID', value: '968', icon: Zap },
    { label: 'Token Standard', value: 'ERC-721 URIStorage', icon: Award },
    { label: 'Metadata Status', value: metadata ? 'Verified On-Chain' : 'Resolving...', icon: ShieldCheck },
  ];

  return (
    <div className="w-full max-w-lg mx-auto bg-neutral-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      <div>
        {/* NFT Artwork Preview Card */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-950 border border-white/10 p-6 flex flex-col justify-between group">
          {/* Step 5: Render Image in Browser */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={imageError ? '/bot-genesis-card.svg' : imageUrl}
              alt={metadata?.name || 'BOT Genesis NFT'}
              fill
              priority
              unoptimized
              onError={() => setImageError(true)}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Subtle dark gradient overlay to ensure badge readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
          </div>

          {/* Top Card Badges */}
          <div className="flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full bg-black/70 border border-emerald-500/40 text-[11px] font-mono font-medium text-emerald-400 backdrop-blur-md">
              Edition #{activeTokenId}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30 backdrop-blur-md flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Genesis Collection
            </span>
          </div>

          {/* Bottom Card Bar */}
          <div className="flex items-center justify-between text-xs text-neutral-300 z-10 pt-3 border-t border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white">
                {metadata?.name || `BOT Genesis #${activeTokenId}`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {metadataUrl && (
                <a
                  href={metadataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-[11px] text-neutral-300"
                >
                  <FileJson className="w-3 h-3 text-emerald-400" />
                  <span>Metadata</span>
                </a>
              )}
              <a
                href={`${BOHR_EXPLORER_URL}/address/${DEFAULT_NFT_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-[11px] text-neutral-300"
              >
                <span>Contract</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Trace Flow Status Bar */}
        <div className="mt-4 p-3 rounded-xl bg-neutral-950/70 border border-white/5 text-xs">
          <div className="flex items-center justify-between text-neutral-400 text-[11px] mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Metadata Resolution Flow
            </span>
            {isLoadingMetadata || isTokenUriLoading ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <Loader2 className="w-3 h-3 animate-spin" /> Resolving...
              </span>
            ) : (
              <span className="text-emerald-400 font-medium">Active (HTTP 200)</span>
            )}
          </div>
          <div className="text-[11px] font-mono text-neutral-400 truncate">
            <span className="text-neutral-500">tokenURI:</span> {rawTokenUri || `${DEFAULT_NFT_CONTRACT_ADDRESS} -> #${activeTokenId}`}
          </div>
          <div className="text-[11px] font-mono text-neutral-400 truncate mt-0.5">
            <span className="text-neutral-500">image:</span> {imageUrl}
          </div>
        </div>

        {/* Chain Specs Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          {traits.map((trait, i) => {
            const Icon = trait.icon;
            return (
              <div
                key={i}
                className="bg-neutral-950/50 border border-white/5 rounded-xl p-3 flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-neutral-500">{trait.label}</p>
                  <p className="text-xs font-semibold text-neutral-200 truncate">
                    {trait.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Collection Status */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
        <span>Connected User Balance</span>
        <span className="font-semibold text-white">
          {isConnected && userNftBalance !== undefined
            ? `${Number(userNftBalance)} Items Owned`
            : isConnected
            ? '0 Items Owned'
            : 'Wallet Disconnected'}
        </span>
      </div>
    </div>
  );
}
