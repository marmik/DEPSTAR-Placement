/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1057E5',
        'secondary': '#132858',
        'light': '#E8EDFF',
      },
    }
  },
  plugins: [],
}