/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff4c3b',
        secondary: '#333333',
        background: '#f8f9fa'
      }
    },
  },
  plugins: [],
}
