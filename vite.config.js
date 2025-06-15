// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Aquí incluimos explícitamente todos los módulos relacionados con @tanstack/query
    // para asegurar que Vite los pre-optimiza correctamente y resuelve sus dependencias.
    include: [
      '@tanstack/react-query',
      '@tanstack/react-query-persist-client',
      '@tanstack/query-sync-storage-persister', // <--- ¡Añadido aquí!
    ],
    // Asegúrate de que 'exclude' no contenga esta dependencia
    // exclude: [], // Si existe, asegúrate de que no excluya los paquetes de tanstack
  },
});
