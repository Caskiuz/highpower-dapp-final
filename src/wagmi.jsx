import { createConfig, WagmiConfig, http } from 'wagmi';
import { bscTestnet, mainnet, sepolia, bsc } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { metaMask, walletConnect, injected } from '@wagmi/connectors';
import React from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react'; // Esta línea es la clave

// 1. Get Project ID (Tu Project ID real de WalletConnect)
const projectId = '56246e8df9c9151e77b7e93def28838e';

// 2. Metadata para WalletConnect Modal
const metadata = {
  name: 'HighPower DApp',
  description: 'Decentralized Application for HighPower Coin',
  url: 'https://highpowercoin.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 3. Crea la configuración de Wagmi
const config = createConfig({
  autoConnect: true,
  chains: [mainnet, sepolia, bsc, bscTestnet],
  connectors: [
    metaMask(),
    walletConnect({
      projectId,
      showQrModal: true,
    }),
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
  storage: localStorage,
});

// 4. Inicializa el Web3Modal
createWeb3Modal({ wagmiConfig: config, projectId, chains: [mainnet, sepolia, bsc, bscTestnet] });

// 5. Crea un QueryClient para @tanstack/react-query
const queryClient = new QueryClient();

// 6. Componente Wrapper que proporciona los contextos de Wagmi y React Query
export function WagmiProviderWrapper({ children }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
}
