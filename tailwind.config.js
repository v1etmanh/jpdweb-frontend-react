module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#F1F5F9", /* 60% */
        surface: "#FFFFFF",
        text: {
          primary: "#1E293B",
          secondary: "#475569",
          muted: "#64748B",
        },
        border: {
          light: "#E2E8F0",
          main: "#CBD5E1",
          dark: "#94A3B8",
        },
        primary: {
          30: "#06B6D4", /* 30% */
          light: "#67E8F9",
          dark: "#0E7490",
        },
        accent: {
          10: "#F97316", /* 10% */
          light: "#FDBA74",
          dark: "#EA580C",
        },
        status: {
          completed: "#10B981",
          required: "#F97316", 
          optional: "#64748B",
        }
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 1s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(15px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        progressGrow: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(6, 182, 212, 0.06)',
        'medium': '0 4px 20px rgba(6, 182, 212, 0.08)',
        'card': '0 6px 25px rgba(6, 182, 212, 0.1)',
      },
    },
  },
  plugins: [],
};