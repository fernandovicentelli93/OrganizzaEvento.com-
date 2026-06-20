import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8F3",
        ink: "#2F2430",
        muted: "#7A6471",
        line: "#E8D9D2",
        blush: "#FCE7EF",
        petal: "#FFF4EF",
        peach: "#F6B5A7",
        sage: "#9BAE8B",
        plum: "#6B4058",
        violet: {
          cta: "#C9567B",
          hover: "#B94568"
        }
      },
      fontFamily: {
        editorial: ["Georgia", "Cambria", "\"Times New Roman\"", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "\"Segoe UI\"", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 44px rgba(47, 36, 48, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
