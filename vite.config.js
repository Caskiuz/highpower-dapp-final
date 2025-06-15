    // vite.config.js
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    export default defineConfig({
      plugins: [react()],
      // Eliminamos la sección optimizeDeps para que Vite use su comportamiento por defecto
    });
    
