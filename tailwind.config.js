/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      screens: {
        // A real, independent tablet composition (iPad portrait/landscape,
        // Android tablets) instead of inheriting the desktop ("lg") layout
        // shrunk into a narrower viewport. Only used on the specific
        // components that needed a dedicated tablet treatment (Header, Hero);
        // every other lg:/md: usage across the site is untouched.
        tablet: { min: "768px", max: "1179px" },
        desktop: "1180px",
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        accent: "var(--color-accent)",
        light: "var(--color-light)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      maxWidth: {
        container: "1600px",
      },
      letterSpacing: {
        widest2: "0.2em",
      },
    },
  },
  plugins: [],
};
