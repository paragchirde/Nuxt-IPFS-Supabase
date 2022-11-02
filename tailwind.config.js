const colors = require('tailwindcss/colors')

module.exports = {
  content:[
    'components/**/*.{vue,js,ts}',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'composables/**/*.{js,ts}',
    'plugins/**/*.{js,ts}',
    'App.{js,ts,vue}',
    'app.{js,ts,vue}',
    'Error.{js,ts,vue}',
    'error.{js,ts,vue}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        white: colors.white,
        red: colors.red,
        blue: colors.blue,
        indigo: colors.indigo,
        green: colors.emerald,
        yellow: colors.yellow,
        orange: colors.orange,
        neutral: colors.neutral,
        gray: colors.gray,
        lime: colors.lime,
    },
    container: {
        center: true,
        padding: {
            DEFAULT: '0.5rem',
            sm: '1rem',
            md: '1rem',
            lg: '2rem',
            xl: '5rem',
            '2xl': '6rem',
        },
    },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
