import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#F5F0E8",
        foreground: "#111118",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#5B4FE8",
          light: "#7C71F0",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "rgba(17, 17, 24, 0.05)",
          foreground: "rgba(17, 17, 24, 0.5)",
        },
        accent: {
          DEFAULT: "#5B4FE8",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#111118",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#111118",
        },
        sidebar: {
          DEFAULT: "#1A1A2E",
          foreground: "#FFFFFF",
        }
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #5B4FE8, #7C71F0)',
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
        input: "8px",
        button: "8px",
        card: "12px",
        sidebar: "16px",
      },
      boxShadow: {
        'card-subtle': '0 2px 8px -2px rgba(17, 17, 24, 0.05)',
        'sidebar-float': '0 10px 30px -5px rgba(26, 26, 46, 0.2)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
