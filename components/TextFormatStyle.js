import { textFormatCSS, tfClass } from "@/lib/textFormat";

// Server component: renders nothing unless the admin actually set alignment,
// indentation, size, weight, line-height, letter-spacing, max-width or
// margins for this block (opt-in, non-breaking).
export default function TextFormatStyle({ id, format, mode = "text", sizeCategory }) {
  const css = textFormatCSS(tfClass(id), format, mode, sizeCategory);
  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
