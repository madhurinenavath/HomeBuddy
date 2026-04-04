export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6d28d9", // Tailwind purple-700
        secondary: "#db2777", // Tailwind pink-600
        background: "#f8fafc", // Tailwind slate-50
      }
    },
  },
  plugins: [],
}
