// Generic, reusable "text format" system used by the admin panel so the
// person editing the site can control alignment, indentation, size, weight,
// line-height, letter-spacing, max-width and top/bottom spacing on each
// individual text block (title, subtitle, paragraph, description, CTA...),
// independently, with optional overrides for tablet and mobile.
//
// A format object looks like:
//   {
//     align, indentLeft, indentRight, firstLine,      // position/indent
//     fontSizePercent,                                 // % of this block's own reference size
//     weight,                                          // "100".."900"
//     lineHeightPercent,                                // % of a 1.5 baseline
//     letterSpacing,                                    // px (can be negative)
//     maxWidth,                                          // % of the containing column
//     marginTop, marginBottom,                            // px
//     tablet: { ...same fields, only used when set },
//     mobile: { ...same fields, only used when set },
//   }
//
// Every field is optional. Nothing set = no visual change at all (the
// current design is untouched), matching the rest of the site's "opt-in,
// non-breaking" pattern for admin controls.
//
// `fontSizePercent` is a multiplier against a fixed reference size for that
// block's category (see SIZE_CATEGORIES below) — 100% is the block's normal,
// "classic" size. Once an admin sets an explicit per-device size, that device
// uses this flat value instead of the automatic fluid/responsive size —
// which is the point of a manual per-device override.

export const ALIGN_OPTIONS = [
  { value: "", label: "Como está" },
  { value: "left", label: "Izquierda" },
  { value: "center", label: "Centro" },
  { value: "right", label: "Derecha" },
  { value: "justify", label: "Justificado" },
];

export const WEIGHT_OPTIONS = [
  { value: "", label: "Como está" },
  { value: "100", label: "Thin" },
  { value: "200", label: "Extra Light" },
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Extra Bold" },
  { value: "900", label: "Black" },
];

// Reference rem size per block "category" — matches this project's classic
// (pre-fluid) Tailwind scale, so 100% reads as "the normal size for this
// kind of block" and the admin can dial it up or down from there.
export const SIZE_CATEGORIES = {
  "heading-xs": 0.75,
  "heading-sm": 0.875,
  "heading-base": 1,
  "heading-lg": 1.125,
  "heading-xl": 1.25,
  "heading-2xl": 1.5,
  "heading-3xl": 1.875,
  "heading-4xl": 2.25,
  "heading-5xl": 3,
  "heading-6xl": 3.75,
  "body-xs": 0.75,
  "body-sm": 0.875,
  "body-base": 1,
  "body-lg": 1.125,
  "hero-title": 3.75,
  "hero-subtitle": 1.5,
  "hero-text": 1.0625,
  "stats-value": 3.75,
  "btn": 1,
  "label-xxs": 0.6875,
};
const DEFAULT_SIZE_REF = 1;

function declarationsFor(fmt, mode, sizeRef) {
  if (!fmt) return null;
  const decls = [];

  if (fmt.align) {
    if (mode === "flex") {
      // The block itself is a flex row (e.g. an eyebrow label with an icon,
      // or a row of buttons); it needs to span the available width for
      // justify-content to have anything to work with.
      decls.push(`justify-content:${{ left: "flex-start", center: "center", right: "flex-end", justify: "space-between" }[fmt.align] || fmt.align} !important`);
      decls.push("width:100% !important");
    } else {
      decls.push(`text-align:${fmt.align} !important`);
    }
  }
  if (fmt.indentLeft) decls.push(`padding-left:${Number(fmt.indentLeft)}px !important`);
  if (fmt.indentRight) decls.push(`padding-right:${Number(fmt.indentRight)}px !important`);
  if (mode !== "flex" && fmt.firstLine) decls.push(`text-indent:${Number(fmt.firstLine)}px !important`);

  if (fmt.fontSizePercent) {
    decls.push(`font-size:calc(${sizeRef}rem * ${Number(fmt.fontSizePercent) / 100}) !important`);
  }
  if (fmt.weight) decls.push(`font-weight:${fmt.weight} !important`);
  if (fmt.lineHeightPercent) {
    decls.push(`line-height:calc(1.5 * ${Number(fmt.lineHeightPercent) / 100}) !important`);
  }
  if (fmt.letterSpacing !== undefined && fmt.letterSpacing !== "" && fmt.letterSpacing !== null) {
    decls.push(`letter-spacing:${Number(fmt.letterSpacing)}px !important`);
  }
  if (fmt.maxWidth) decls.push(`max-width:${Number(fmt.maxWidth)}% !important`);
  if (fmt.marginTop !== undefined && fmt.marginTop !== "" && fmt.marginTop !== null) {
    decls.push(`margin-top:${Number(fmt.marginTop)}px !important`);
  }
  if (fmt.marginBottom !== undefined && fmt.marginBottom !== "" && fmt.marginBottom !== null) {
    decls.push(`margin-bottom:${Number(fmt.marginBottom)}px !important`);
  }

  return decls.length ? decls.join(";") : null;
}

// Builds the raw CSS (base + tablet/mobile media queries) for one block.
// `mode`: "text" (default, for headings/paragraphs/CTAs in normal flow) or
// "flex" (for a row of buttons laid out with display:flex, where alignment
// has to be done with justify-content instead of text-align).
// `sizeCategory`: key into SIZE_CATEGORIES, used as the reference for the
// "Tamaño (%)" field. Defaults to a plain 1rem reference if omitted.
export function textFormatCSS(className, fmt, mode = "text", sizeCategory) {
  if (!fmt) return "";
  const sizeRef = SIZE_CATEGORIES[sizeCategory] ?? DEFAULT_SIZE_REF;
  let css = "";
  const base = declarationsFor(fmt, mode, sizeRef);
  if (base) css += `.${className}{${base}}`;
  const tablet = declarationsFor(fmt.tablet, mode, sizeRef);
  if (tablet) css += `@media (max-width:1023px){.${className}{${tablet}}}`;
  const mobile = declarationsFor(fmt.mobile, mode, sizeRef);
  if (mobile) css += `@media (max-width:639px){.${className}{${mobile}}}`;
  return css;
}

export function tfClass(id) {
  return `tf-${id}`;
}

// ---- Box format: for containers (buttons, cards, boxes) — width/height,
// padding & margin on all four sides, border-radius, internal text size,
// content alignment. Same opt-in + per-device-override pattern as above.

function boxDeclarationsFor(fmt) {
  if (!fmt) return null;
  const decls = [];
  if (fmt.width) decls.push(`width:${Number(fmt.width)}% !important`);
  if (fmt.maxWidth) decls.push(`max-width:${Number(fmt.maxWidth)}% !important`);
  if (fmt.height) decls.push(`height:${Number(fmt.height)}px !important`);
  if (fmt.maxHeight) decls.push(`max-height:${Number(fmt.maxHeight)}px !important`);
  if (fmt.paddingTop !== undefined && fmt.paddingTop !== "") decls.push(`padding-top:${Number(fmt.paddingTop)}px !important`);
  if (fmt.paddingBottom !== undefined && fmt.paddingBottom !== "") decls.push(`padding-bottom:${Number(fmt.paddingBottom)}px !important`);
  if (fmt.paddingLeft !== undefined && fmt.paddingLeft !== "") decls.push(`padding-left:${Number(fmt.paddingLeft)}px !important`);
  if (fmt.paddingRight !== undefined && fmt.paddingRight !== "") decls.push(`padding-right:${Number(fmt.paddingRight)}px !important`);
  if (fmt.marginTop !== undefined && fmt.marginTop !== "") decls.push(`margin-top:${Number(fmt.marginTop)}px !important`);
  if (fmt.marginBottom !== undefined && fmt.marginBottom !== "") decls.push(`margin-bottom:${Number(fmt.marginBottom)}px !important`);
  if (fmt.marginLeft !== undefined && fmt.marginLeft !== "") decls.push(`margin-left:${Number(fmt.marginLeft)}px !important`);
  if (fmt.marginRight !== undefined && fmt.marginRight !== "") decls.push(`margin-right:${Number(fmt.marginRight)}px !important`);
  if (fmt.borderRadius !== undefined && fmt.borderRadius !== "") decls.push(`border-radius:${Number(fmt.borderRadius)}px !important`);
  if (fmt.fontSizePercent) decls.push(`font-size:calc(1rem * ${Number(fmt.fontSizePercent) / 100}) !important`);
  if (fmt.align) {
    const justify = { left: "flex-start", center: "center", right: "flex-end" }[fmt.align] || fmt.align;
    decls.push(`justify-content:${justify} !important`);
    decls.push(`text-align:${fmt.align} !important`);
  }
  return decls.length ? decls.join(";") : null;
}

export function boxFormatCSS(className, fmt) {
  if (!fmt) return "";
  let css = "";
  const base = boxDeclarationsFor(fmt);
  if (base) css += `.${className}{${base}}`;
  const tablet = boxDeclarationsFor(fmt.tablet);
  if (tablet) css += `@media (max-width:1023px){.${className}{${tablet}}}`;
  const mobile = boxDeclarationsFor(fmt.mobile);
  if (mobile) css += `@media (max-width:639px){.${className}{${mobile}}}`;
  return css;
}
