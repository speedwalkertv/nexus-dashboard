import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#17100D", 800: "#241812", 700: "#33221A", 600: "#4A342A" },
        creme: { DEFAULT: "#FBF5EF", 200: "#F4EAE0", 300: "#E5D3C2" },
        terracota: { DEFAULT: "#E8590C", dark: "#C2450A", soft: "#F5A667" },
        dourado: { DEFAULT: "#FF8C1A", claro: "#FFC670" },
        rose: { DEFAULT: "#C98A92", soft: "#EBD2D5" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: { content: "72rem" },
      transitionTimingFunction: {
        suave: "cubic-bezier(0.4, 0, 0.2, 1)",
        entrada: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
