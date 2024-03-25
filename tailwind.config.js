/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "2xl": { max: "1535px" },
        // => @media (max-width: 1535px) { ... }

        xl: { max: "1279px" },
        // => @media (max-width: 1279px) { ... }

        lg: { max: "1023px" },
        // => @media (max-width: 1023px) { ... }

        md: { max: "767px" },
        // => @media (max-width: 767px) { ... }

        sm: { max: "639px" },
        // => @media (max-width: 639px) { ... }
      },
      colors: {
        boardingDark: "hsla(240, 10%, 10%, 1)",
        mainDark: "#17171C;",
        lightDark: "hsla(225, 10%, 13%, 1)",
        mainAccent: "hsla(216, 100%, 50%, 1)",
      },
    },
    animation: {
      "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;",
    },
    fontFamily: {
      roboto: ["var(--font-roboto)"],
      lora: ["var(--font-lora)"],
    },
    backdropBrightness: {
      60: ".6",
    },
  },
  plugins: [],
};
