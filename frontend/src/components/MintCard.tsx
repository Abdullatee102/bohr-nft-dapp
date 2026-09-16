'use client';

import React, { useState } from 'react';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
} from 'wagmi';
import { useAppKit, useAppKitNetwork } from '@reown/appkit/react';
import { formatEther } from 'viem';
import { bohrTestnet } from '@/config/chains';
import {
  DEFAULT_NFT_CONTRACT_ADDRESS,
  MY_NFT_ABI,
  BOHR_EXPLORER_URL,
} from '@/config/contracts';
import {
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
  ExternalLink,
  Loader2,
  AlertCircle,
  Coins,
  Layers,
} from 'lucide-react';

export function MintCard() {
  const { open } = useAppKit();
  const { isConnected, address } = useAccount();
  const { chainId, switchNetwork } = useAppKitNetwork();

  const isBohrNetwork = chainId === bohrTestnet.id;
  const [quantity, setQuantity] = useState(1);

  // User wallet BOT balance on Bohr Testnet
  const { data: userBalance } = useBalance({
    address,
    chainId: bohrTestnet.id,
  });

  // Read Live Contract State
  const { data: collectionName } = useReadContract({
    address: DEFAULT_NFT_CONTRACT_ADDRESS,
    abi: MY_NFT_ABI,
    functionName: 'name',
    chainId: bohrTestnet.id,
  });

  const { data: collectionSymbol } = useReadContract({
    address: DEFAULT_NFT_CONTRACT_ADDRESS,
    abi: MY_NFT_ABI,
    functionName: 'symbol',
    chainId: bohrTestnet.id,
  });

  const { data: maxSupply } = useReadContract({
    address: DEFAULT_NFT_CONTRACT_ADDRESS,
    abi: MY_NFT_ABI,
    functionName: 'MAX_SUPPLY',
    chainId: bohrTestnet.id,
  });

  const { data: mintPrice, refetch: refetchMintPrice } = useReadContract({
    address: DEFAULT_NFT_CONTRACT_ADDRESS,
    abi: MY_NFT_ABI,
    functionName: 'mintPrice',
    chainId: bohrTestnet.id,
  });

  const { data: totalMinted, refetch: refetchTotalMinted } = useReadContract({
    address: DEFAULT_NFT_CONTRACT_ADDRESS,
    abi: MY_NFT_ABI,
    functionName: 'totalMinted',
    chainId: bohrTestnet.id,
  });

  const { data: userNftBalance, refetch: refetchUserNftBalance } = useReadContract({
    address: DEFAULT_NFT_CONTRACT_ADDRESS,
    abi: MY_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: bohrTestnet.id,
  });

  // Contract Mint Interaction
  const {
    writeContractAsync,
    data: txHash,
    isPending: isSubmitting,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: bohrTestnet.id,
  });

  // Calculate pricing
  const unitPriceWei = mintPrice ?? BigInt('10000000000000000'); // 0.01 BOT default
  const totalCostWei = unitPriceWei * BigInt(quantity);
  const totalCostBot = formatEther(totalCostWei);

  // Mint Handler
  const handleMint = async () => {
    if (!isConnected) {
      open();
      return;
    }

    if (!isBohrNetwork) {
      switchNetwork(bohrTestnet);
      return;
    }

    if (!address) return;

    resetWrite();

    try {
      if (quantity === 1) {
        await writeContractAsync({
          address: DEFAULT_NFT_CONTRACT_ADDRESS,
          abi: MY_NFT_ABI,
          functionName: 'mint',
          args: [address, `ipfs://bohr-nft/${Number(totalMinted || 0) + 1}.json`],
          value: totalCostWei,
          chainId: bohrTestnet.id,
        });
      } else {
        await writeContractAsync({
          address: DEFAULT_NFT_CONTRACT_ADDRESS,
          abi: MY_NFT_ABI,
          functionName: 'mintBatch',
          args: [address, BigInt(quantity)],
          value: totalCostWei,
          chainId: bohrTestnet.id,
        });
      }

      // Refetch stats
      setTimeout(() => {
        refetchTotalMinted();
        refetchUserNftBalance();
        refetchMintPrice();
      }, 3000);
    } catch (err) {
      console.error('Minting failed:', err);
    }
  };

  const formattedMaxSupply = maxSupply
    ? Number(maxSupply).toLocaleString()
    : '150,000,000';
  const formattedMinted = totalMinted ? Number(totalMinted).toLocaleString() : '0';

  return (
    <div className="w-full max-w-lg mx-auto bg-neutral-900/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Background glowing gradient */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Live Minting
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {collectionName || 'Bohr Genesis NFT'}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Symbol: {collectionSymbol || 'BOTNFT'} • Bohr Testnet
          </p>
        </div>

        {isConnected && userNftBalance !== undefined && (
          <div className="text-right">
            <span className="text-xs text-neutral-400">You Own</span>
            <div className="text-lg font-bold text-emerald-400">
              {Number(userNftBalance)} <span className="text-xs font-normal text-neutral-400">NFTs</span>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 my-6">
        <div className="bg-neutral-950/60 border border-white/5 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Minted</span>
          </div>
          <div className="text-lg font-bold text-white">
            {formattedMinted} <span className="text-xs text-neutral-500 font-normal">/ {formattedMaxSupply}</span>
          </div>
        </div>

        <div className="bg-neutral-950/60 border border-white/5 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span>Price per NFT</span>
          </div>
          <div className="text-lg font-bold text-white">
            {formatEther(unitPriceWei)} <span className="text-xs text-neutral-400 font-normal">BOT</span>
          </div>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="bg-neutral-950/40 border border-white/5 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-neutral-300">Select Quantity</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1 || isSubmitting || isConfirming}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-xl text-white w-6 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
              disabled={quantity >= 10 || isSubmitting || isConfirming}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-3 border-t border-white/5">
          <span className="text-neutral-400">Total Payable</span>
          <div className="text-right">
            <span className="text-base font-bold text-emerald-400">{totalCostBot} BOT</span>
            {userBalance && (
              <p className="text-[11px] text-neutral-500">
                Wallet Balance: {parseFloat(userBalance.formatted).toFixed(4)} {userBalance.symbol}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mint Button */}
      <button
        onClick={handleMint}
        disabled={isSubmitting || isConfirming}
        className="w-full py-4 px-6 rounded-xl font-bold text-base text-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Confirming in Wallet...
          </>
        ) : isConfirming ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Broadcasting on Bohr...
          </>
        ) : !isConnected ? (
          'Connect Wallet to Mint'
        ) : !isBohrNetwork ? (
          'Switch to Bohr Testnet'
        ) : (
          `Mint ${quantity} NFT${quantity > 1 ? 's' : ''} (${totalCostBot} BOT)`
        )}
      </button>

      {/* Transaction Notifications */}
      {txHash && (
        <div className="mt-4 p-4 rounded-xl bg-neutral-950/80 border border-emerald-500/30">
          <div className="flex items-start gap-3">
            {isConfirmed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Loader2 className="w-5 h-5 text-emerald-400 animate-spin shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">
                {isConfirmed ? 'Mint Successful!' : 'Minting in Progress...'}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5 truncate">
                Tx: {txHash}
              </p>
              <a
                href={`${BOHR_EXPLORER_URL}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 mt-2 font-medium"
              >
                <span>View on BohrScan Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {(writeError || confirmError) && (
        <div className="mt-4 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-red-200">Transaction Failed: </span>
            <span>{(writeError || confirmError)?.message.slice(0, 140)}...</span>
          </div>
        </div>
      )}
    </div>
  );
}

