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
          accent: "#3B82F6",
          success: "#22C55E",
          text: "#E2EAF8",
          muted: "#4A6080",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
