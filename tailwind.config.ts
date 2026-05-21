import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        modRed: "#A91D22",
        modOrange: "#F59E0B",
        modBlack: "#111827",
        modWhite: "#FFFFFF",
        modGrey: {
          50: "#F9F9F9",
          100: "#F4F4F4",
          200: "#E5E5E5",
          300: "#D4D4D4",
          800: "#262626",
          900: "#171717",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Barlow", "Brandon Grotesque", "sans-serif"],
        heading: ["var(--font-oswald)", "Knockout 48 Featherweight", "Brandon Grotesque", "sans-serif"],
        display: ["var(--font-architects)", "Architects Daughter", "cursive"],
        barlow: ["var(--font-barlow)", "Barlow", "sans-serif"],
      },
      animation: {
        "slide-out-left": "slideOutLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "slide-out-right": "slideOutRight 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "pizza-grow": "pizzaGrowRotate 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
      keyframes: {
        slideOutLeft: {
          from: {
            transform: "translateX(0)",
            opacity: "1",
          },
          to: {
            transform: "translateX(-60px)",
            opacity: "0.7",
          },
        },
        slideOutRight: {
          from: {
            transform: "translateX(0)",
            opacity: "1",
          },
          to: {
            transform: "translateX(60px)",
            opacity: "0.7",
          },
        },
        pizzaGrowRotate: {
          from: {
            transform: "scale(1) rotate(0deg)",
          },
          to: {
            transform: "scale(1.3) rotate(20deg)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
