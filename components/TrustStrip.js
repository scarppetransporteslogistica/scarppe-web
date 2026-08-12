import TextFormatStyle from "./TextFormatStyle";
import BoxFormatStyle, { bfClass } from "./BoxFormatStyle";

const ICONS = [
  "M3 17h1a2 2 0 0 0 4 0h7a2 2 0 0 0 4 0h1M3 17V8a1 1 0 0 1 1-1h9v10M16 7h3.5l3.5 4v6h-2",
  "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z",
  "M3 21V9l9-5 9 5v12H3ZM9 21v-7h6v7",
  "M21 8 12 3 3 8l9 5 9-5ZM3 8v8l9 5 9-5V8",
];

// Same plain row style everywhere (icon + text, no background, no divider
// lines). Below tabletLandscape it's a 2-column grid; the left column
// hugs the left edge and the right column hugs the right edge, instead of
// every item centered in its own cell — with items of such different
// lengths, centering left a ragged look, while aligning outward reads as
// one deliberate group with two clean edges.
//
// Two earlier attempts at this both broke once "Más de 80 años..." wrapped
// onto two lines: aligning the item's own (shrink-to-fit) box against the
// edge moved depending on how wide that box happened to be, and pushing
// icon+text apart with flex `justify-end` let the browser position them
// independently, so the icon visibly drifted away from its own text.
// Fixing it for good means keeping icon+text as ONE tight, never-splits
// unit (an inline-flex "chip" that only ever shrinks to fit its own
// content, so there's no spare room for the icon to drift into) and using
// plain CSS `text-align` on the full-width wrapper around it to push that
// whole chip to the left or right edge — text-align only ever moves the
// chip as a whole, it can never pull icon and text apart from each other.
export default function TrustStrip({ items, formats }) {
  return (
    <div className="relative bg-accent shadow-[0_-10px_18px_-14px_rgba(0,0,0,0.35)]">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-5 tabletLandscape:py-4 desktop:py-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:gap-x-6 tabletLandscape:flex tabletLandscape:flex-row tabletLandscape:flex-wrap tabletLandscape:justify-center tabletLandscape:gap-x-10 tabletLandscape:gap-y-3 desktop:flex desktop:flex-row desktop:flex-wrap desktop:justify-center desktop:gap-x-10 desktop:gap-y-3">
          {items.map((text, i) => {
            const bfmt = (formats || [])[i] || {};
            const isRightCol = i % 2 === 1;
            const outerAlign = isRightCol ? "text-right" : "text-left";
            const innerAlign = isRightCol ? "text-right" : "text-left";
            return (
              <span
                key={text}
                className={`relative block w-full ${outerAlign} tabletLandscape:w-auto desktop:w-auto tabletLandscape:text-center desktop:text-center ${bfClass(`inicio-badge-${i}-box`)}`}
              >
                <BoxFormatStyle id={`inicio-badge-${i}-box`} format={bfmt.box} />
                <TextFormatStyle id={`inicio-badge-${i}-texto`} format={bfmt.text} mode="flex" sizeCategory="body-sm" />
                <span
                  className={`tf-inicio-badge-${i}-texto inline-flex items-start tabletLandscape:items-center desktop:items-center gap-1.5 sm:gap-2.5 font-heading text-[9.5px] xs:text-[10.5px] sm:text-xs font-bold uppercase tracking-normal sm:tracking-wide text-primary leading-snug`}
                >
                  <span className="shrink-0 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full border-[1.5px] border-current mt-px tabletLandscape:mt-0 desktop:mt-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[14px] sm:h-[14px]">
                      <path d={ICONS[i % ICONS.length]} />
                    </svg>
                  </span>
                  <span className={`${innerAlign} tabletLandscape:text-center desktop:text-center`}>{text}</span>
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
