/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/components/**/*.{js,jsx,ts,tsx}", "./src/screens/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "regular": ["Poppins_400Regular"],
        "semibold": ["Poppins_600SemiBold"],
        "bold": ["Poppins_700Bold"]
      },
    },
  },
  plugins: [],
}