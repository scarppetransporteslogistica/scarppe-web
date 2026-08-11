import TextFormatStyle from "./TextFormatStyle";
import BoxFormatStyle, { bfClass } from "./BoxFormatStyle";

const ICONS = [
  "M3 17h1a2 2 0 0 0 4 0h7a2 2 0 0 0 4 0h1M3 17V8a1 1 0 0 1 1-1h9v10M16 7h3.5l3.5 4v6h-2",
  "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z",
  "M3 21V9l9-5 9 5v12H3ZM9 21v-7h6v7",
  "M21 8 12 3 3 8l9 5 9-5ZM3 8v8l9 5 9-5V8",
];

export default function TrustStrip({ items, formats }) {
  return (
    <div className="relative bg-accent shadow-[0_-10px_18px_-14px_rgba(0,0,0,0.35)]">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-10 py-5 tabletLandscape:py-4 desktop:py-4">
        <div className="flex flex-col items-center gap-3 tabletLandscape:flex-row tabletLandscape:flex-wrap tabletLandscape:justify-center tabletLandscape:gap-x-10 tabletLandscape:gap-y-3 desktop:flex-row desktop:flex-wrap desktop:justify-center desktop:gap-x-10 desktop:gap-y-3">
          {items.map((text, i) => {
            const bfmt = (formats || [])[i] || {};
            return (
              <span key={text} className={`relative ${bfClass(`inicio-badge-${i}-box`)}`}>
                <BoxFormatStyle id={`inicio-badge-${i}-box`} format={bfmt.box} />
                <TextFormatStyle id={`inicio-badge-${i}-texto`} format={bfmt.text} mode="flex" sizeCategory="body-sm" />
                <span className={`tf-inicio-badge-${i}-texto flex items-center gap-3 font-heading text-xs sm:text-sm font-bold uppercase tracking-normal sm:tracking-wide text-primary leading-snug bg-white/20 rounded-full px-5 py-2.5 tabletLandscape:bg-transparent tabletLandscape:rounded-none tabletLandscape:px-0 tabletLandscape:py-0 desktop:bg-transparent desktop:rounded-none desktop:px-0 desktop:py-0`}>
                  <span className="shrink-0 flex items-center justify-center w-7 h-7 sm:w-6 sm:h-6 rounded-full border-[1.5px] border-current">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
