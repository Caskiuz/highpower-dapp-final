import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
  ],
  resolve: {
    alias: {
      'assert': 'assert/',
      'buffer': 'buffer/',
      'crypto': 'crypto-browserify',
      'stream': 'stream-browserify',
      'util': 'util/',
    },
  },
  server: {
    fs: {
      strict: false // Permite servir archivos fuera del root (para ABIs, etc.)
    }
  },
  optimizeDeps: {
    include: [
      'wagmi',
      'wagmi/chains',
      '@wagmi/connectors',
      'viem',
      '@tanstack/react-query',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      loader: {
        '.json': 'json',
        '.js': 'jsx', 
      },
    },
  },
});
