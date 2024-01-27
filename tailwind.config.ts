import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "426px",
        xss: "375px",
      },

      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },

      colors: {
        dark: "#212529",
        primary: "#ff2f00",
        secondary: "#22313f",
        gray: "#3c3c3c",
      },
    },
  },
  plugins: [],
};
export default config;
