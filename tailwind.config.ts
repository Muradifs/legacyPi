/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'flash': 'flash 0.5s ease-out forwards',
        'float': 'float 20s infinite linear',
        'breathe': 'breathe 4s infinite ease-in-out',
      },
      keyframes: {
        flash: {
          '0%': { opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { opacity: '0' },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-100vh)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      },
    },
  },
  plugins: [],
}