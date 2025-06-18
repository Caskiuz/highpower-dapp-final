/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkGray: 'var(--dark-gray)',
        lightGrayText: 'var(--light-gray-text)',
        primaryPurple: 'var(--primary-purple)', // Usa camelCase (opcional, pero más claro)
        secondaryBlue: 'var(--secondary-blue)',
        accentGreen: 'var(--accent-green)',
        accentYellow: 'var(--accent-yellow)',
        offWhite: 'var(--off-white)',
      },
    },
  },
  plugins: [],
}
