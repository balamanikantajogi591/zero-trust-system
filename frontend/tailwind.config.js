/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0c",
        card: "#121214",
        primary: "#3b82f6",
        secondary: "#10b981",
        accent: "#f43f5e",
        glow: "rgba(59, 130, 246, 0.5)",
      },
      boxShadow: {
        'glow': '0 0 15px rgba(59, 130, 246, 0.3)',
      }
    },
  },
  plugins: [],
}
