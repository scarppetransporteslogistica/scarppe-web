import { boxFormatCSS } from "@/lib/textFormat";

// Server component for container/box-level overrides (buttons, cards,
// panels): width, height, padding/margin on all sides, radius, internal
// text size and content alignment, per device. Opt-in, non-breaking.
export default function BoxFormatStyle({ id, format }) {
  const css = boxFormatCSS(`bf-${id}`, format);
  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export function bfClass(id) {
  return `bf-${id}`;
}
