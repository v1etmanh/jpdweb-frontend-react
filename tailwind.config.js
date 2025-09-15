module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

 fontFamily: {
  sans: ['"DM Sans"', 'sans-serif'],
        dm: ['"DM Sans"', 'sans-serif'],
          grotesk: ['"Host Grotesk"', 'sans-serif'],
      },

    },
  },
  plugins: [],
};
