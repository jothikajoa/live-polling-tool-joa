export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f9f5ff",
          100: "#f3ebff",
          200: "#e9d5ff",
          300: "#ddb3ff",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
        accent: {
          50: "#e0f7ff",
          100: "#b3eaff",
          200: "#80dcff",
          300: "#4dcdff",
          400: "#2abfff",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#164e63",
          900: "#0f2847",
        },
        dark: {
          bg: "#07070a",
          surface: "#0d0d12",
          card: "#16161b",
          border: "#2a2a35",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        glow: "0 0 20px rgba(168, 85, 247, 0.3)",
        "glow-lg": "0 0 40px rgba(168, 85, 247, 0.4)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
      backdropBlur: {
        glass: "10px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
        slideUp: "slideUp 0.6s ease-out",
        slideDown: "slideDown 0.6s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      fontFamily: {
        sans: ["Inter", "DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}
