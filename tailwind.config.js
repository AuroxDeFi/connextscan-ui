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
          900: '#1d1d1d',
          800: '#252525',
          700: '#2d2d2d',
          600: '#404040',
          500: '#a5a5a5',
          400: '#b0b0b0',
          300: '#d2d2d2',
          200: '#dadada',
          100: '#e2e2e2',
          50: '#f0f0f0',
        },
      },
    },
  },
}