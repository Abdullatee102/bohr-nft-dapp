import { defineChain } from 'viem';

/**
 * Bohr Testnet Chain Definition
 * Chain ID: 968
 * Native Currency: BOT
 * RPC: https://rpc.bohr.life
 * Explorer: https://scan.bohr.life
 */
export const bohrTestnet = defineChain({
  id: 968,
  name: 'Bohr Testnet',
  nativeCurrency: {
    name: 'Bohr Token',
    symbol: 'BOT',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.bohr.life'],
    },
    public: {
      http: ['https://rpc.bohr.life'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BohrScan',
      url: 'https://scan.bohr.life',
    },
  },
  testnet: true,
});

