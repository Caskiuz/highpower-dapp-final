export default {
  plugins: {
    // CORREGIDO: Usar @tailwindcss/postcss en lugar de 'tailwindcss' directamente
    '@tailwindcss/postcss': {}, // Nueva forma de importar el plugin de PostCSS de Tailwind
    autoprefixer: {},
  },
}
