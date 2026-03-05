/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0D1F3C',
        'navy-light': '#162D52',
        gold: '#D4A843',
        'gold-light': '#F0C96A',
        cream: '#F5F0E8',
        'cream-dark': '#EAE3D5',
        sage: '#4A7C6F',
        rose: '#C0544E',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
    },
  },
  plugins: [],
}
