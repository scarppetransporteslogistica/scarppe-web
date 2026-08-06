import { sectionTypographyCSS } from "@/lib/textFormat";

// Server component: renders the (opt-in) section-wide typography default
// for every .font-heading/.font-body text inside the given wrapper class.
// Renders nothing unless the admin actually configured something for this
// section, in any device/orientation.
export default function SectionTypographyStyle({ className, format }) {
  const css = sectionTypographyCSS(className, format);
  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
