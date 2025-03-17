import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",     // ✅ Next.js App Router (if used)
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",   // ✅ Next.js Pages Router (if used)
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",     // ✅ Ensure all folders are scanned
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border) / 1)", // ✅ Explicit opacity value to fix missing colors
        background: "hsl(var(--background) / 1)",
        foreground: "hsl(var(--foreground) / 1)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
