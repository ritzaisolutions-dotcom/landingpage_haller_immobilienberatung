import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dash: {
          bg: "#07101E",
          card: "#0D1F3C",
          "card-alt": "#091528",
          border: "#1A3A6A",
          "border-subtle": "#0F2544",
          accent: "#3B82F6",
          "accent-hover": "#2563EB",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          text: "#E2EAF8",
          muted: "#4A6080",
          disabled: "#2A3A55",
        },
        haller: {
          teal: "#00AFCB",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        input: "8px",
        pill: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
