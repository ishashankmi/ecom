/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '420px',
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        primary: '#0041C2',
        'primary-dark': '#003399',
        'primary-light': '#1a5ce6',
      },
    },
  },
  plugins: [],
};
