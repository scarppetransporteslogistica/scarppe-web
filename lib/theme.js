export function buildThemeVars(settings) {
  const colors = settings?.colors || {};
  const fonts = settings?.fonts || {};
  const typo = settings?.typography || {};

  const lines = [
    `--color-primary: ${colors.primary || "#191D33"};`,
    `--color-secondary: ${colors.secondary || "#04325A"};`,
    `--color-tertiary: ${colors.tertiary || "#193F73"};`,
    `--color-accent: ${colors.accent || "#6AACE4"};`,
    `--color-light: ${colors.light || "#D9E8F5"};`,
    `--color-background: ${colors.background || "#FFFFFF"};`,
    `--font-heading: '${fonts.heading || "Barlow Condensed"}', sans-serif;`,
    `--font-body: '${fonts.body || "Barlow"}', sans-serif;`,
    // Size scale always has a safe multiplicative default of 1 (no visual change).
    `--heading-scale: ${typo.headingScale || 1};`,
    `--body-scale: ${typo.bodyScale || 1};`,
  ];

  // Weight has no safe "neutral" value (it fully replaces whatever weight
  // each element already had), so we only emit it when the admin actually
  // picked one. The matching CSS rule is scoped behind a body class that is
  // only added when the value exists, so nothing changes until then.
  if (typo.headingWeight) lines.push(`--heading-weight: ${typo.headingWeight};`);
  if (typo.bodyWeight) lines.push(`--body-weight: ${typo.bodyWeight};`);

  return `:root{${lines.join("\n    ")}}`;
}

// Body classes that switch on the (opt-in, non-breaking) weight overrides.
export function typographyBodyClasses(settings) {
  const typo = settings?.typography || {};
  const classes = [];
  if (typo.headingWeight) classes.push("override-heading-weight");
  if (typo.bodyWeight) classes.push("override-body-weight");
  return classes.join(" ");
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

export const TYPOGRAPHY_WEIGHT_OPTIONS = [
  { value: "", label: "Como está (por defecto)" },
  { value: "400", label: "Normal" },
  { value: "600", label: "Semi-negrita" },
  { value: "700", label: "Negrita" },
  { value: "800", label: "Extra negrita" },
];

export const TYPOGRAPHY_SIZE_OPTIONS = [
  { value: "0.85", label: "Pequeño" },
  { value: "1", label: "Normal" },
  { value: "1.15", label: "Grande" },
  { value: "1.3", label: "Extra grande" },
];

export function googleFontsHref(fonts) {
  const families = Array.from(new Set([fonts?.heading, fonts?.body].filter(Boolean)));
  const query = families
    .map((f) => `family=${encodeURIComponent(f)}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}
