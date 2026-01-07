/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Dodaj putanje do tvojih fajlova ako treba
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-animate'),  // Dodaj ovo ako koristiš animacije iz plugina
  ],
};