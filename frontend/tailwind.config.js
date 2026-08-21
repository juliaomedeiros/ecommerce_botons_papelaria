/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tutas: {
          primary: '#173440',
          secondary: '#3fb9c8',
          dark: '#0c1a20',
          light: '#f4fbfd',
          gold: '#eab308'
        }
      }
    },
  },
  plugins: [],
}
