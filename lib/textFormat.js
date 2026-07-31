// Generic, reusable "text format" system used by the admin panel so the
// person editing the site can set text alignment and indentation on each
// individual text block (title, subtitle, paragraph, description, CTA...),
// independently, with optional overrides for tablet and mobile.
//
// A format object looks like:
//   {
//     align: "left" | "center" | "right" | "justify" | "",
//     indentLeft: number,   // px
//     indentRight: number,  // px
//     firstLine: number,    // px (first-line indent)
//     tablet: { ...same 4 fields, only used when set },
//     mobile: { ...same 4 fields, only used when set },
//   }
//
// Every field is optional. Nothing set = no visual change at all (the
// current design is untouched), matching the rest of the site's "opt-in,
// non-breaking" pattern for admin controls.

export const ALIGN_OPTIONS = [
  { value: "", label: "Como está" },
  { value: "left", label: "Izquierda" },
  { value: "center", label: "Centro" },
  { value: "right", label: "Derecha" },
  { value: "justify", label: "Justificado" },
];

const JUSTIFY_MAP = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
  justify: "space-between",
};

function declarationsFor(fmt, mode) {
  if (!fmt) return null;
  const decls = [];
  if (fmt.align) {
    if (mode === "flex") {
      // The block itself is a flex row (e.g. an eyebrow label with an icon,
      // or a row of buttons); it needs to span the available width for
      // justify-content to have anything to work with.
      decls.push(`justify-content:${JUSTIFY_MAP[fmt.align] || fmt.align} !important`);
      decls.push("width:100% !important");
    } else {
      decls.push(`text-align:${fmt.align} !important`);
    }
  }
  if (fmt.indentLeft) decls.push(`padding-left:${Number(fmt.indentLeft)}px !important`);
  if (fmt.indentRight) decls.push(`padding-right:${Number(fmt.indentRight)}px !important`);
  if (mode !== "flex" && fmt.firstLine) decls.push(`text-indent:${Number(fmt.firstLine)}px !important`);
  return decls.length ? decls.join(";") : null;
}

// Builds the raw CSS (base + tablet/mobile media queries) for one block.
// `mode`: "text" (default, for headings/paragraphs/CTAs in normal flow) or
// "flex" (for a row of buttons laid out with display:flex, where alignment
// has to be done with justify-content instead of text-align).
export function textFormatCSS(className, fmt, mode = "text") {
  if (!fmt) return "";
  let css = "";
  const base = declarationsFor(fmt, mode);
  if (base) css += `.${className}{${base}}`;
  const tablet = declarationsFor(fmt.tablet, mode);
  if (tablet) css += `@media (max-width:1023px){.${className}{${tablet}}}`;
  const mobile = declarationsFor(fmt.mobile, mode);
  if (mobile) css += `@media (max-width:639px){.${className}{${mobile}}}`;
  return css;
}

export function tfClass(id) {
  return `tf-${id}`;
}
