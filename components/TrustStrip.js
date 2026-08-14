import TextFormatStyle from "./TextFormatStyle";
import BoxFormatStyle, { bfClass } from "./BoxFormatStyle";

// Icons redesigned to match the reference provided in Figma: a truck for
// "Flota propia", a globe for "Más de 80 años de trayectoria", a map pin
// for "Uruguay - Brasil" and a check-in-circle for "Soluciones logísticas".
// Each icon needs more than one path/shape, so ICONS is now an array of
// functions returning JSX fragments (SVG children), instead of a single
// path string like before.
const ICONS = [
  () => (
    <>
      <path d="M14 17V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a1 1 0 0 0 1 1h2" />
      <path d="M15 17H9" />
      <path d="M19 17h2a1 1 0 0 0 1-1v-3.1a1 1 0 0 0-.22-.62l-3.1-3.9A1 1 0 0 0 17.9 8H14" />
      <circle cx="17" cy="17" r="2" />
      <circle cx="7" cy="17" r="2" />
    </>
  ),
  () => (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a13 13 0 0 1 0 18 13 13 0 0 1 0-18Z" />
      <path d="M3 12h18" />
    </>
  ),
  () => (
    <>
      <path d="M19 10c0 5-7 11-7 11s-7-6-7-11a7 7 0 0 1 14 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  () => (
    <>
      <path d="M20.5 8.5A9 9 0 1 1 15 3.3" />
      <path d="m8 11.5 3 3 8.5-9" />
    </>
  ),
];

// Thin divider lines between the 4 cells, matching the reference: in the
// 2x2 grid (portrait, mobile) item 0 gets a right AND bottom border (the
// shared center lines), item 1 a bottom border, item 2 a right border,
// item 3 none — four border segments total, forming a clean "+" divider
// between all four cells. Per the latest Figma reference, the single row
// (landscape / desktop) no longer has any divider lines at all — the
// lines are a mobile-portrait-only detail now, so every item drops its
// border once we're in landscape.
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
  `${DIVIDER_COLOR} border-r border-b landscape:border-0`,
  `${DIVIDER_COLOR} border-b landscape:border-0`,
  `${DIVIDER_COLOR} border-r landscape:border-0`,
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
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-2 landscape:flex landscape:flex-row landscape:flex-wrap landscape:justify-between landscape:items-stretch">
        {items.map((text, i) => {
          const bfmt = (formats || [])[i] || {};
          const Icon = ICONS[i % ICONS.length];
          return (
            <span
              key={text}
              className={`relative flex justify-center items-center py-6 px-3 sm:py-7 sm:px-5 landscape:py-6 landscape:px-6 sm:landscape:px-10 ${DIVIDER_CLASSES[i % DIVIDER_CLASSES.length]} ${bfClass(`inicio-badge-${i}-box`)}`}
            >
              <BoxFormatStyle id={`inicio-badge-${i}-box`} format={bfmt.box} />
              <TextFormatStyle id={`inicio-badge-${i}-texto`} format={bfmt.text} sizeCategory="body-sm" />
              <span
                className={`tf-inicio-badge-${i}-texto flex flex-col items-center gap-[0.55em] font-heading text-[11px] sm:text-xs landscape:w-[190px] sm:landscape:text-[13px] font-bold uppercase text-primary leading-snug text-center`}
              >
                <span className="shrink-0 flex items-center justify-center w-[2.5em] h-[2.5em] rounded-full border-[0.14em] border-current">
                  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <Icon />
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
