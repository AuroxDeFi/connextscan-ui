const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './components/**/*.js',
    './pages/**/*.js',
    './styles/globals.css',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...colors,
        dark: '#000000',
        light: '#ffffff',
        black: '#131313',
        white: '#ececec',
        slate: {
          ...colors.slate,
          900: '#1e1e1e',
          800: '#292929',
          700: '#343434',
          600: '#4a4a4a',
          500: '#a5a5a5',
          400: '#b5b5b5',
          300: '#cbcbcb',
          200: '#d6d6d6',
          100: '#e1e1e1',
          50: '#f0f0f0',
        },
      },
    },
  },
}