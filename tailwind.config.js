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
        //
        // "tablet" matches TWO ranges:
        //  1) 768-1179px wide, any orientation (portrait tablets, and
        //     narrower landscape tablets/phones).
        //  2) 1180-1366px wide AND landscape AND under 1024px tall — wide
        //     landscape tablets (iPad Pro 11"/12.9" landscape, most Android
        //     tablets landscape) that are ≥1180px wide and would otherwise
        //     fall into "desktop" even though they're a tablet, causing the
        //     much taller desktop composition to overflow/crop on a shorter
        //     tablet screen.
        // "desktop" explicitly excludes range 2 so the two never overlap —
        // same mutually-exclusive design as the admin format engine's
        // per-device media queries (lib/textFormat.js).
        tablet: [
          { min: "768px", max: "1179px" },
          { raw: "(orientation: landscape) and (min-width: 1180px) and (max-width: 1366px) and (max-height: 1024px)" },
        ],
        desktop: {
          raw: "(min-width: 1180px) and (not ((orientation: landscape) and (max-width: 1366px) and (max-height: 1024px)))",
        },
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
