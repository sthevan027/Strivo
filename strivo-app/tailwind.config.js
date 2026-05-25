/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}