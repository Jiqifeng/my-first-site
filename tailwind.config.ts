import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      colors: {
        surface: "var(--surface)",
        ink: "var(--text)",
        "ink-muted": "var(--text-muted)",
        accent: "var(--accent)",
        glass: "var(--glass)",
        "glass-border": "var(--glass-border)",
      },
    },
  },
  plugins: [],
};

export default config;
