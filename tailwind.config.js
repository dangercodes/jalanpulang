/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}",
    "./store/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#926247', // The brownish-gold accent
          600: '#84583f',
          700: '#6e4a35',
          800: '#5a3d2b',
          900: '#462f21',
        },
        gold: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#b45309'
        },
        surface: {
          light: '#ffffff',
          dark: '#2d2420'
        },
        background: {
          light: '#FDFBF7', // Very light cream
          dark: '#1e1815'
        }
      },
      fontFamily: {
        amiri: ["Amiri_400Regular"],
        amiriBold: ["Amiri_700Bold"],
        scheherazade: ["ScheherazadeNew_400Regular"],
        scheherazadeBold: ["ScheherazadeNew_700Bold"],
        inter: ["Inter_400Regular"],
        interMedium: ["Inter_500Medium"],
        interSemiBold: ["Inter_600SemiBold"],
        interBold: ["Inter_700Bold"],
      },
    },
  },
  plugins: [],
}
