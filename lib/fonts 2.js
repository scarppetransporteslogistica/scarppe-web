// Which font-weight values are real/available for each font family in
// GOOGLE_FONT_OPTIONS (lib/theme.js). Used so the admin's "Peso" selector
// only offers weights that actually exist for the chosen font, instead of
// showing all 9 and silently falling back when one doesn't exist.
//
// The Google Fonts <link> (lib/theme.js -> googleFontsHref) always requests
// the full 100-900 range for every family in use, so picking a weight that
// isn't listed here is not destructive — it just isn't offered, to avoid
// confusion when nothing visibly changes.

export const ALL_WEIGHTS = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];

export const FONT_WEIGHTS = {
  "Barlow Condensed": ALL_WEIGHTS,
  Barlow: ALL_WEIGHTS,
  Outfit: ALL_WEIGHTS,
  Poppins: ALL_WEIGHTS,
  Inter: ALL_WEIGHTS,
  Montserrat: ALL_WEIGHTS,
  "Playfair Display": ["400", "500", "600", "700", "800", "900"],
  Roboto: ["100", "300", "400", "500", "700", "900"],
  Raleway: ALL_WEIGHTS,
  Oswald: ["200", "300", "400", "500", "600", "700"],
  Lato: ["100", "300", "400", "700", "900"],
  Nunito: ["200", "300", "400", "500", "600", "700", "800", "900"],
  Merriweather: ["300", "400", "700", "900"],
  Rubik: ["300", "400", "500", "600", "700", "800", "900"],
  "Work Sans": ALL_WEIGHTS,
  "DM Sans": ALL_WEIGHTS,
  "Bebas Neue": ["400"],
  Archivo: ALL_WEIGHTS,
  "Libre Franklin": ALL_WEIGHTS,
  "Source Sans 3": ["200", "300", "400", "500", "600", "700", "800", "900"],
  "Josefin Sans": ["100", "200", "300", "400", "500", "600", "700"],
  Manrope: ["200", "300", "400", "500", "600", "700", "800"],
  "Space Grotesk": ["300", "400", "500", "600", "700"],
  Sora: ["100", "200", "300", "400", "500", "600", "700", "800"],
  "Plus Jakarta Sans": ["200", "300", "400", "500", "600", "700", "800"],
  Urbanist: ALL_WEIGHTS,
  "Red Hat Display": ["400", "500", "600", "700", "800", "900"],
  Figtree: ["300", "400", "500", "600", "700", "800", "900"],
  Epilogue: ALL_WEIGHTS,
  Karla: ["200", "300", "400", "500", "600", "700", "800"],
  Mulish: ["200", "300", "400", "500", "600", "700", "800", "900"],
  "Public Sans": ALL_WEIGHTS,
  "IBM Plex Sans": ["100", "200", "300", "400", "500", "600", "700"],
  "IBM Plex Serif": ["100", "200", "300", "400", "500", "600", "700"],
  Cabin: ["400", "500", "600", "700"],
  Quicksand: ["300", "400", "500", "600", "700"],
  Prompt: ALL_WEIGHTS,
  Fraunces: ALL_WEIGHTS,
  "Cormorant Garamond": ["300", "400", "500", "600", "700"],
  "Crimson Text": ["400", "600", "700"],
  Lora: ["400", "500", "600", "700"],
  "PT Serif": ["400", "700"],
  "Noto Sans": ALL_WEIGHTS,
  "Titillium Web": ["200", "300", "400", "600", "700", "900"],
  "Exo 2": ALL_WEIGHTS,
  Saira: ALL_WEIGHTS,
  Chivo: ALL_WEIGHTS,
  Onest: ALL_WEIGHTS,
};

export function weightsForFont(fontName) {
  return FONT_WEIGHTS[fontName] || ALL_WEIGHTS;
}
