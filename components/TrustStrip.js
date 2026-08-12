import TextFormatStyle from "./TextFormatStyle";
import BoxFormatStyle, { bfClass } from "./BoxFormatStyle";

const ICONS = [
  "M3 17h1a2 2 0 0 0 4 0h7a2 2 0 0 0 4 0h1M3 17V8a1 1 0 0 1 1-1h9v10M16 7h3.5l3.5 4v6h-2",
  "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z",
  "M3 21V9l9-5 9 5v12H3ZM9 21v-7h6v7",
  "M21 8 12 3 3 8l9 5 9-5ZM3 8v8l9 5 9-5V8",
];

// Rebuilt to match the reference layout: icon stacked ABOVE its (centered)
// text, everywhere — instead of icon-beside-text rows, which is what kept
// breaking (icon drifting away from its text once a label wrapped to two
// lines, uneven left/right edges, etc.). Stacking removes that whole class
// of bug: each item is one self-contained, independently centered column,
// so there's nothing for an icon to "drift" away from.
//
// The grid-vs-row switch is now based on ORIENTATION (Tailwind's built-in
// `landscape:`, default-as-portrait), not on a width breakpoint: 2x2 grid
// in portrait (phone or tablet, upright), a single centered row of 4 in
// landscape (phone sideways, tablet sideways, or desktop) — matching the
// reference mockup exactly, and sidestepping every previous bug where a
// WIDE-but-SHORT landscape phone got miscategorized by a width breakpoint.
//
// Icon size is set in `em`, and the font-size override (from the existing
// per-badge "Formato" control in Panel > Inicio) is applied to the same
// element the icon sizes are relative to — so raising a badge's text size
// there also scales its icon up in step, with no separate icon-size
// control needed.
export default function TrustStrip({ items, formats }) {
  return (
    <div className="relative bg-accent shadow-[0_-10px_18px_-14px_rgba(0,0,0,0.35)]">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-10 py-7 sm:py-8 landscape:py-5">
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-8 sm:gap-y-8 landscape:flex landscape:flex-row landscape:flex-wrap landscape:justify-center landscape:items-start landscape:gap-x-8 landscape:gap-y-5">
          {items.map((text, i) => {
            const bfmt = (formats || [])[i] || {};
            return (
              <span key={text} className={`relative flex justify-center ${bfClass(`inicio-badge-${i}-box`)}`}>
                <BoxFormatStyle id={`inicio-badge-${i}-box`} format={bfmt.box} />
                <TextFormatStyle id={`inicio-badge-${i}-texto`} format={bfmt.text} sizeCategory="body-sm" />
                <span
                  className={`tf-inicio-badge-${i}-texto flex flex-col items-center gap-[0.55em] font-heading text-[11px] sm:text-xs landscape:w-[120px] font-bold uppercase text-primary leading-snug text-center`}
                >
                  <span className="shrink-0 flex items-center justify-center w-[2.5em] h-[2.5em] rounded-full border-[0.14em] border-current">
                    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={ICONS[i % ICONS.length]} />
                    </svg>
                  </span>
                  <span>{text}</span>
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
