import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito", ...defaultTheme.fontFamily.sans],
        serif: ["Playfair Display", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        sunflower: "#FFC72C",
        sky: "#B4E0FF",
        cream: "#FFF8E1",
        forest: "#1B3B1F",
        "sunflower-soft": "#FEE1A7",
      },
      backgroundImage: {
        "sunset-radial": "radial-gradient(circle at top, rgba(255,199,44,0.3), transparent 60%)",
      },
    },
  },
  plugins: [],
};
