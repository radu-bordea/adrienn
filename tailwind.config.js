/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enables dark mode using a class strategy
  content: [
    "./index.html", // Vite entry point
    "./src/**/*.{js,ts,jsx,tsx}", // All your React files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
