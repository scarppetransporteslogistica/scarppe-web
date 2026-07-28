export function buildThemeVars(settings) {
  const colors = settings?.colors || {};
  const fonts = settings?.fonts || {};
  return `:root{
    --color-primary: ${colors.primary || "#191D33"};
    --color-secondary: ${colors.secondary || "#04325A"};
    --color-tertiary: ${colors.tertiary || "#193F73"};
    --color-accent: ${colors.accent || "#6AACE4"};
    --color-light: ${colors.light || "#D9E8F5"};
    --color-background: ${colors.background || "#FFFFFF"};
    --font-heading: '${fonts.heading || "Barlow Condensed"}', sans-serif;
    --font-body: '${fonts.body || "Barlow"}', sans-serif;
  }`;
}

export const GOOGLE_FONT_OPTIONS = [
  "Barlow Condensed",
  "Barlow",
  "Poppins",
  "Inter",
  "Montserrat",
  "Playfair Display",
  "Roboto",
  "Raleway",
];

export function googleFontsHref(fonts) {
  const families = Array.from(new Set([fonts?.heading, fonts?.body].filter(Boolean)));
  const query = families
    .map((f) => `family=${encodeURIComponent(f)}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}
