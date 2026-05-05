/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        card: "#12121a",
        primary: "#00f0ff",
        secondary: "#ff003c",
        accent: "#a900ff"
      }
    },
  },
  plugins: [],
}
