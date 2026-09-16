'use client';

import React, { ReactNode } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, cookieToInitialState, type State } from 'wagmi';
import { projectId, networks, wagmiAdapter, config } from '@/config/wagmi';
import { bohrTestnet } from '@/config/chains';

// Set up QueryClient
const queryClient = new QueryClient();

// Project Metadata for AppKit
const metadata = {
  name: 'Bohr NFT Minting dApp',
  description: 'Production NFT Minting Platform on Bohr Testnet (Chain ID 968)',
  url: 'http://localhost:3000',
  icons: ['https://scan.bohr.life/favicon.ico'],
};

// Initialize AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [bohrTestnet],
  defaultNetwork: bohrTestnet,
  metadata,
  features: {
    analytics: true,
    email: false,
    socials: [],
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#10b981',
    '--w3m-border-radius-master': '12px',
  },
});

export default function Web3ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies?: string | null;
}) {
  const initialState: State | undefined = cookies
    ? cookieToInitialState(config, cookies)
    : undefined;

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

