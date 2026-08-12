import TextFormatStyle from "./TextFormatStyle";
import BoxFormatStyle, { bfClass } from "./BoxFormatStyle";

const ICONS = [
  "M3 17h1a2 2 0 0 0 4 0h7a2 2 0 0 0 4 0h1M3 17V8a1 1 0 0 1 1-1h9v10M16 7h3.5l3.5 4v6h-2",
  "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z",
  "M3 21V9l9-5 9 5v12H3ZM9 21v-7h6v7",
  "M21 8 12 3 3 8l9 5 9-5ZM3 8v8l9 5 9-5V8",
];

// Thin divider lines between the 4 cells, matching the reference: in the
// 2x2 grid (portrait) item 0 gets a right AND bottom border (the shared
// center lines), item 1 a bottom border, item 2 a right border, item 3
// none — four border segments total, forming a clean "+" divider between
// all four cells. In the single row (landscape) it's simpler: each item
// except the last gets a right border, so three lines split the row of 4.
// (Not using Tailwind's divide-x/divide-y here: those add a border to
// every item after the first in DOM order regardless of which grid row/
// column it's actually in, which does not produce a correct cross pattern
// for a wrapped 2-column grid.)
// `border-primary/15` (Tailwind's opacity-modifier syntax) silently
// produces no CSS at all for this project's theme colors — they're plain
// hex strings (e.g. "#191D33"), not the special "R G B" channel format
// that syntax needs, the same underlying issue found earlier with
// `bg-light/40`. Using `color-mix()` directly as an arbitrary value sides
// steps that limitation and still tracks whatever primary color color the
// admin has configured in Panel > General.
const DIVIDER_COLOR = "border-[color-mix(in_srgb,var(--color-primary)_15%,transparent)]";
const DIVIDER_CLASSES = [
  `${DIVIDER_COLOR} border-r border-b landscape:border-b-0`,
  `${DIVIDER_COLOR} border-b landscape:border-b-0 landscape:border-r`,
  `${DIVIDER_COLOR} border-r`,
  "",
];

// Icon stacked above its centered text — each item is a self-contained
// column, so nothing can drift apart the way it did with icon-beside-text
// rows. 2x2 grid in portrait, a single centered row of 4 in landscape,
// switched by orientation (not width) so a wide-but-short landscape phone
// is never miscategorized. Icon size is in `em`, tied to the same
// font-size the existing per-badge "Formato" admin control already sets,
// so enlarging a badge's text there enlarges its icon too.
export default function TrustStrip({ items, formats }) {
  return (
    <div className="relative bg-accent shadow-[0_-10px_18px_-14px_rgba(0,0,0,0.35)]">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-2 landscape:flex landscape:flex-row landscape:flex-wrap landscape:justify-center landscape:items-stretch">
        {items.map((text, i) => {
          const bfmt = (formats || [])[i] || {};
          return (
            <span
              key={text}
              className={`relative flex justify-center items-center py-6 px-3 sm:py-7 sm:px-5 landscape:py-5 landscape:px-6 sm:landscape:px-9 ${DIVIDER_CLASSES[i % DIVIDER_CLASSES.length]} ${bfClass(`inicio-badge-${i}-box`)}`}
            >
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
  );
}
