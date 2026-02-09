/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          900: "#0a0e3a",
          800: "#0f1147",
          700: "#1a1f6c",
          600: "#2d3494",
          500: "#4e54c8",
          400: "#6c71d4",
          300: "#9b9fe0",
        },
      },
    },
  },
  plugins: [],
};
