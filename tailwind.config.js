/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        livelo: {
          red: "#E11D48",
          gray: "#F3F4F6",
          dark: "#1F2937",
        },
      },
    },
  },
  plugins: [],
};
