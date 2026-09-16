import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';
import Web3ContextProvider from '@/context';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Bohr Genesis NFT | Official Minting dApp',
  description: 'Production NFT Minting Platform on Bohr Testnet (Chain ID 968)',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookies = headersList.get('cookie');

  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 selection:bg-emerald-500 selection:text-black">
        <Web3ContextProvider cookies={cookies}>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <footer className="border-t border-white/10 py-6 text-center text-xs text-neutral-500">
            <p>
              Bohr Testnet • Chain ID: 968 • Native Token: BOT • Total Supply: 150 Million •{' '}
              <a
                href="https://scan.bohr.life"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline"
              >
                BohrScan Explorer
              </a>
            </p>
          </footer>
        </Web3ContextProvider>
      </body>
    </html>
  );
}
