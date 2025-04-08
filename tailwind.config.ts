/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [require('daisyui')],
  darkMode: 'class',
  mode: 'jit',
};
