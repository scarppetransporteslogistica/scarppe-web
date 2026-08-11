import TextFormatStyle from "./TextFormatStyle";
import BoxFormatStyle, { bfClass } from "./BoxFormatStyle";

const ICONS = [
  "M3 17h1a2 2 0 0 0 4 0h7a2 2 0 0 0 4 0h1M3 17V8a1 1 0 0 1 1-1h9v10M16 7h3.5l3.5 4v6h-2",
  "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z",
  "M3 21V9l9-5 9 5v12H3ZM9 21v-7h6v7",
  "M21 8 12 3 3 8l9 5 9-5ZM3 8v8l9 5 9-5V8",
];

// Same centered-row layout on EVERY device (no more separate stacked
// mobile/tablet-portrait treatment) — icon + text inline, no background
// pill, no divider lines. Only the font size adapts (smaller on narrow
// screens) so four items still wrap cleanly into a couple of centered rows
// instead of overflowing or needing a stacked, menu-like list.
export default function TrustStrip({ items, formats }) {
  return (
    <div className="relative bg-accent shadow-[0_-10px_18px_-14px_rgba(0,0,0,0.35)]">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-5 tabletLandscape:py-4 desktop:py-4">
        <div className="flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2.5 sm:gap-x-7 sm:gap-y-3 tabletLandscape:gap-x-10 tabletLandscape:gap-y-3 desktop:gap-x-10 desktop:gap-y-3">
          {items.map((text, i) => {
            const bfmt = (formats || [])[i] || {};
            return (
              <span key={text} className={`relative ${bfClass(`inicio-badge-${i}-box`)}`}>
                <BoxFormatStyle id={`inicio-badge-${i}-box`} format={bfmt.box} />
                <TextFormatStyle id={`inicio-badge-${i}-texto`} format={bfmt.text} mode="flex" sizeCategory="body-sm" />
                <span className={`tf-inicio-badge-${i}-texto flex items-center gap-2 sm:gap-2.5 font-heading text-[10px] sm:text-xs font-bold uppercase tracking-normal sm:tracking-wide text-primary leading-snug`}>
                  <span className="shrink-0 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full border-[1.5px] border-current">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[14px] sm:h-[14px]">
                      <path d={ICONS[i % ICONS.length]} />
                    </svg>
                  </span>
                  {text}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
