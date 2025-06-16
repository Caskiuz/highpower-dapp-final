// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Define tus variables de color CSS aquí para que Tailwind las use
      colors: {
        'dark-gray': 'var(--dark-gray)',
        'light-gray-text': 'var(--light-gray-text)',
        'primary-purple': 'var(--primary-purple)',
        'secondary-blue': 'var(--secondary-blue)',
        'accent-green': 'var(--accent-green)',
        'accent-yellow': 'var(--accent-yellow)',
        'off-white': 'var(--off-white)',
      },
    },
  },
  plugins: [], // ¡ESTO DEBE ESTAR VACÍO!
}
