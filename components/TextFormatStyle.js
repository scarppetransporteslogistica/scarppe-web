import { textFormatCSS, tfClass } from "@/lib/textFormat";

// Server component: renders nothing unless the admin actually set alignment
// or indentation for this block (opt-in, non-breaking).
export default function TextFormatStyle({ id, format, mode = "text" }) {
  const css = textFormatCSS(tfClass(id), format, mode);
  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
