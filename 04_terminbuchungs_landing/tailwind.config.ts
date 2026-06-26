import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lp: {
          primary: "#00AFCB",
          bg: "#FFFFFF",
          surface: "#F7F7F7",
          text: "#1A1A1A",
          muted: "#6B7280",
          border: "#E5E7EB",
          success: "#059669",
        },
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "8px",
        btn: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
