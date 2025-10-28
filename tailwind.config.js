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
        background: "#F5E6D3",
        surface: "#FEFAF5",
        text: {
          primary: "#5D4E37",
          secondary: "#7A6B55",
          muted: "#9C8E7A",
        },
        border: {
          light: "#E8D7C3",
          main: "#D4B896",
          dark: "#C8A97E",
        },
        primary: {
          light: "#F3E9DD",
          main: "#D4B896",
          dark: "#B8945F",
        },
        status: {
          completed: "#A8C48A",
          required: "#D4A76A", 
          optional: "#B8A897",
        }
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      animation: {
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
        progressGrow: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(93, 78, 55, 0.06)',
        'medium': '0 4px 20px rgba(93, 78, 55, 0.08)',
        'card': '0 6px 25px rgba(93, 78, 55, 0.1)',
      },
    },
  },
  
  plugins: [],
};