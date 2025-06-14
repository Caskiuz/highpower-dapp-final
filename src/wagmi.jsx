import { createConfig, WagmiConfig, http } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { metaMask, walletConnect, injected } from '@wagmi/connectors';
import React from 'react'; // Necesario para JSX

// 1. Crea la configuración de Wagmi
const config = createConfig({
  autoConnect: true,
  chains: [bscTestnet], // Usa la testnet de BNB Smart Chain
  connectors: [
    metaMask(),
    walletConnect({
      // IMPORTANTE: Vite usa VITE_ prefix para variables de entorno.
      // Reemplazado con el Project ID proporcionado.
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '56246e8df9c9151e77b7e93def28838e', // <<-- ¡CORREGIDO CON TU ID!
      showQrModal: true,
    }),
    injected(),
  ],
  transports: {
    [bscTestnet.id]: http(),
  },
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
