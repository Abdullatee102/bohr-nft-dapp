'use client';

import React from 'react';
import { MintCard } from '@/components/MintCard';
import { NFTDisplay } from '@/components/NFTDisplay';
import { Sparkles, ArrowRight, Shield, Zap, Flame, Compass } from 'lucide-react';
import { BOHR_EXPLORER_URL, DEFAULT_NFT_CONTRACT_ADDRESS } from '@/config/contracts';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 mb-6 backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Bohr Testnet Live Phase</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
      </div>

      {/* Hero Headline */}
      <div className="text-center max-w-3xl mb-12">
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
          Mint the Genesis{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            NFT Collection
          </span>{' '}
          on Bohr
        </h1>
        <p className="mt-4 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto">
          The foundational ERC-721 collection on the Bohr blockchain. Featuring verified on-chain
          storage, ultra-low fees in native BOT, and instantaneous mint finality.
        </p>
      </div>

      {/* Main Grid: Minting Card + NFT Display */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-16">
        <MintCard />
        <NFTDisplay />
      </div>

      {/* Features Overview */}
      <div className="w-full max-w-6xl border-t border-white/10 pt-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Why Mint on Bohr Network?
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Engineered for high-throughput Web3 applications and zero-friction digital assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Sub-Second Finality</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Mint your NFTs with blazing speed. Enjoy instant confirmation times with near-zero gas costs in BOT.
            </p>
          </div>

          <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Battle-Tested Security</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Built on OpenZeppelin ERC-721 and Ownable standards with pragma 0.8.37 and audited checks-effects-interactions.
            </p>
          </div>

          <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Full Explorer Support</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Every mint is immediately indexable and verifiable on BohrScan with live metadata and transaction traces.
            </p>
          </div>
        </div>
      </div>

      {/* Network Quick Links */}
      <div className="w-full max-w-4xl mt-12 p-6 rounded-2xl bg-neutral-950 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Verified Smart Contract
          </span>
          <p className="text-xs font-mono text-neutral-300 mt-0.5 truncate max-w-md">
            {DEFAULT_NFT_CONTRACT_ADDRESS}
          </p>
        </div>
        <a
          href={`${BOHR_EXPLORER_URL}/address/${DEFAULT_NFT_CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 transition-colors cursor-pointer shrink-0"
        >
          <span>View on BohrScan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
