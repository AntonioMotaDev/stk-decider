/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'ink-black': '#02111b',
        'gunmetal': '#3f4045',
        'shadow-grey': '#30292f',
        'blue-slate': '#5d737e',
        'white': '#fcfcfc',
      },
    },
  },
  plugins: [],
}
