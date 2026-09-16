import { cookieStorage, createStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { bohrTestnet } from './chains';

const configuredProjectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!configuredProjectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not defined');
}

export const projectId = configuredProjectId;

export const networks = [bohrTestnet];

// Set up the Wagmi Adapter for Reown AppKit
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;

