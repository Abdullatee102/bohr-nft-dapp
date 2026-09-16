'use client';

import React from 'react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { bohrTestnet } from '@/config/chains';
import { BOHR_EXPLORER_URL, DEFAULT_NFT_CONTRACT_ADDRESS } from '@/config/contracts';
import { ShieldCheck, ExternalLink, AlertTriangle } from 'lucide-react';

export function Navbar() {
  const { isConnected } = useAppKitAccount();
  const { chainId, switchNetwork } = useAppKitNetwork();

  const isBohrNetwork = chainId === bohrTestnet.id;

  return (
    <header className="w-full border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Network */}
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-[1.5px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center font-black text-xl text-emerald-400 tracking-tighter">
              BOT
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-wide">
                Bohr Genesis
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                NFT dApp
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono hidden sm:block">
              Chain ID: 968 • Bohr Testnet
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {isConnected && !isBohrNetwork && (
            <button
              onClick={() => switchNetwork(bohrTestnet)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Switch to Bohr
            </button>
          )}

          {isConnected && isBohrNetwork && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Bohr Testnet (968)
            </div>
          )}

          <a
            href={`${BOHR_EXPLORER_URL}/address/${DEFAULT_NFT_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-400 hover:text-emerald-400 transition-colors px-3 py-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Contract</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          {/* Reown AppKit standard web component button */}
          <div className="flex items-center">
            <appkit-button balance="show" />
          </div>
        </div>
      </div>
    </header>
  );
}
