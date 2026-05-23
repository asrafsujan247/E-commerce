/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      serif: ["Georgia", "serif"],
      mono: ["JetBrains Mono", "monospace"],
    },
    extend: {
      colors: {
        // ── BRAND PALETTES ─────────────────────────────────────────────────
        // To retheme: swap the hex values below. The "500" shade is the base
        // brand color; lighter/darker shades are generated around it.
        //   primary   base → #f59e47
        //   secondary base → #000000
        //   tertiary  base → #ffffff
        // ───────────────────────────────────────────────────────────────────
        primary: {
          50: "#fef6ee",
          100: "#feecdb",
          200: "#fcd5b0",
          300: "#fab97d",
          400: "#f8a15a",
          500: "#f59e47", // ← PRIMARY BASE
          600: "#e07424",
          700: "#bc5519",
          800: "#964318",
          900: "#7a3818",
          950: "#421a08",
        },
        secondary: {
          50: "#f7f7f7",
          100: "#efefef",
          200: "#dcdcdc",
          300: "#bdbdbd",
          400: "#989898",
          500: "#7c7c7c",
          600: "#656565",
          700: "#525252",
          800: "#3d3d3d",
          900: "#292929",
          950: "#000000", // ← SECONDARY BASE
        },
        tertiary: {
          50: "#ffffff", // ← TERTIARY BASE
          100: "#f5f5f5",
          200: "#ebebeb",
          300: "#d6d6d6",
          400: "#b8b8b8",
          500: "#9e9e9e",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121",
          950: "#0d0d0d",
        },
        accent: {
          orange: "#f97316",
          amber: "#f59e0b",
          rose: "#f43f5e",
          violet: "#8b5cf6",
          cyan: "#06b6d4",
        },
      },
      height: {
        header: "560px",
        "screen-90": "90vh",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      backgroundImage: {
        "page-header": "url('/page-header-bg.jpg')",
        "contact-header": "url('/page-header-bg-2.jpg')",
        subscribe: "url('/subscribe-bg.jpg')",
        "app-download": "url('/app-download.jpg')",
        cta: "url('/cta-bg.png')",
        "cta-1": "url('/cta/cta-bg-1.png')",
        "cta-2": "url('/cta/cta-bg-2.png')",
        "cta-3": "url('/cta/cta-bg-3.png')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        card: "0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.05)",
        "card-hover":
          "0 0 0 1px rgba(0, 0, 0, 0.05), 0 8px 16px rgba(0, 0, 0, 0.1)",
        product:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        "product-hover":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "bounce-slow": "bounce 2s infinite",
        "pulse-slow": "pulse 3s infinite",
        shimmer: "shimmer 2s infinite linear",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

module.exports = config;
