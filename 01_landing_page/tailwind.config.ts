import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        haller: {
          bg: "#07101E",
          card: "#0D1F3C",
          border: "#1A3A6A",
          accent: "#00AFCB",
          success: "#22C55E",
          text: "#E2EAF8",
          muted: "#4A6080",
        },
        website: {
          primary: "#00AFCB",
          bg: "#F7F7F7",
          dark: "#000000",
          text: "#333333",
          muted: "#5C727D",
          border: "#EEEEEE",
        },
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        haller: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
