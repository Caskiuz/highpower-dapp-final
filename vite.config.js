import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Asegúrate de que esta línea esté presente

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // <<-- ¡¡SE HA ELIMINADO LA SECCIÓN 'esbuild'!! -->>
  // El plugin @vitejs/plugin-react debería manejar el JSX por sí mismo.
  // Esbuild es usado internamente por Vite, y esta configuración explícita
  // a veces puede generar conflictos o ser redundante en versiones específicas.
});
