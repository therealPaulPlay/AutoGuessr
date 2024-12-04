/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        besley: ['Besley', 'sans-serif'],
        batuphat: ['Batuphat', 'Besley', 'sans-serif'],
        batuphatExtrude: ['BatuphatExtrude', 'Besley', 'sans-serif']
      },
      colors: {
        orange: '#e76531',
        orangeDark: '#a8542b',
        green: '#67b865',
        greenDark: '#4f844e',
        white: '#fcfaee',
        black: '#222222',
        tanLight: 'rgb(247, 240, 224)',
        tanMedium: '#ecdfcc',
        tanDark: '#cc9d82'
      }
    },
  },
  plugins: [],
};
