/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-600": "hsl(225, 33%, 12%)",
        "dark-700": "hsl(225, 25%, 9%)",
        "dark-800": "hsl(225, 25%, 6%)",
        "dark-900": "hsl(225, 25%, 3%)",
      },
    },
  },
  plugins: [],
};
