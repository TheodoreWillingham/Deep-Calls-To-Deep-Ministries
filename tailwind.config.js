/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "book-shadow": "5px 5px 20px #2e2e2e",
        "back-cover-shadow": "-10px 0 50px 10px #2e2e2e",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".perspective-800": {
          perspective: "800px",
        },
        ".preserve-3d": {
          transformStyle: "preserve-3d",
        },
        ".rotate-y-30": {
          transform: "rotateY(-30deg)",
        },
        ".transition-transform-075s": {
          transition: "transform 0.75s ease",
        },
        ".page-transform": {
          transform:
            "translateX(calc(200px - 50px / 2 - 3px)) rotateY(180deg) translateX(23px)",
        },
        ".back-cover-transform": {
          transform: "translateZ(-50px)",
        },
      });
    },
  ],
};
