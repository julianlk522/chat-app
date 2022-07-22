/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        mainBg: "url('./assets/polygon-scatter-haikei-bg.svg')",
        authBg: "url('./assets/authBg.jpg')",
      },
    },
  },
  plugins: [],
};
