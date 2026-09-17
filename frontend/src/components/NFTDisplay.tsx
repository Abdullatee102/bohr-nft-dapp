'use client';

import React from 'react';
import Image from 'next/image';
import { useAccount, useReadContract } from 'wagmi';
import { bohrTestnet } from '@/config/chains';
import { DEFAULT_NFT_CONTRACT_ADDRESS, MY_NFT_ABI, BOHR_EXPLORER_URL } from '@/config/contracts';
import { ExternalLink, ShieldCheck, Zap, Globe, Award } from 'lucide-react';

export function NFTDisplay() {
  const { address } = useAccount();

  const { data: userNftBalance } = useReadContract({
    address: DEFAULT_NFT_CONTRACT_ADDRESS,
    abi: MY_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: bohrTestnet.id,
  });

  const traits = [
    { label: 'Blockchain', value: 'Bohr Testnet', icon: Globe },
    { label: 'Chain ID', value: '968', icon: Zap },
    { label: 'Token Standard', value: 'ERC-721 URIStorage', icon: Award },
    { label: 'Verified Status', value: 'Active on Testnet', icon: ShieldCheck },
  ];

  return (
    <div className="w-full max-w-lg mx-auto bg-neutral-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      {/* NFT Artwork Preview */}
      <div>
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-emerald-900/40 via-neutral-950 to-cyan-950/40 border border-white/10 p-6 flex flex-col justify-between group">
          <Image
            src="/bot-genesis-card.svg"
            alt="BOT Genesis official card"
            fill
            priority
            className="object-cover opacity-80"
          />
          <div className="flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full bg-black/60 border border-emerald-500/40 text-[11px] font-mono font-medium text-emerald-400 backdrop-blur-md">
              Edition #001
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
              Genesis Collection
            </span>
          </div>

          {/* Central Artwork Emblem */}
          <div className="relative z-10 my-auto flex flex-col items-center text-center py-8">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-[2px] shadow-2xl">
                <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 font-mono">
                  BOT
                </div>
              </div>
            </div>
            <h3 className="mt-5 text-xl font-bold text-white tracking-tight">
              Bohr Genesis Genesis #1
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs">
              Official inaugural NFT collection powered by the high-performance Bohr blockchain.
            </p>
          </div>

          {/* Bottom Card Bar */}
          <div className="flex items-center justify-between text-xs text-neutral-400 z-10 pt-3 border-t border-white/10">
            <span>Standard: ERC-721</span>
            <a
              href={`${BOHR_EXPLORER_URL}/address/${DEFAULT_NFT_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>Contract</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Chain Specs Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-6">
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
          {userNftBalance !== undefined ? `${Number(userNftBalance)} Items` : 'Wallet Disconnected'}
        </span>
      </div>
    </div>
  );
}

