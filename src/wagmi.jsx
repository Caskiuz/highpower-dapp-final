import { createConfig, WagmiConfig, http } from 'wagmi';
import { bscTestnet, mainnet, sepolia, bsc } from 'wagmi/chains'; // Aseguramos que todas las cadenas estén importadas
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { metaMask, walletConnect, injected } from '@wagmi/connectors';
import React from 'react'; // Necesario para JSX

// 1. Crea la configuración de Wagmi
const config = createConfig({
  autoConnect: true,
  // Incluimos mainnet, sepolia, bsc, bscTestnet como en tu App.jsx original
  chains: [mainnet, sepolia, bsc, bscTestnet], 
  connectors: [
    metaMask(),
    walletConnect({
      // IMPORTANTE: Vite usa VITE_ prefix para variables de entorno.
      // Si tienes un .env, asegúrate de que sea VITE_WALLETCONNECT_PROJECT_ID
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '56246e8df9c9151e77b7e93def28838e', // <<-- ¡CORREGIDO CON TU ID!
      showQrModal: true,
    }),
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [bsc.id]: http(),
    [bscTestnet.id]: http(), // Aseguramos que bscTestnet tenga su transport
  },
  storage: localStorage, // Mantener la persistencia en localStorage
});

// 2. Crea un QueryClient para @tanstack/react-query
const queryClient = new QueryClient();

export function WagmiProviderWrapper({ children }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
}
