/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#F3EEE2",
        surface: "#EAE3D3",
        ink: "#17140F",
        muted: "#6B6558",
        violet: "#4C6C9C",
        pink: "#C97B86",
        teal: "#7C9473",
        yellow: "#C9A227",
        red: "#b50d18",
      },
      fontFamily: {
        display: ["Sancreek", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}