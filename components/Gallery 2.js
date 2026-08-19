"use client";
import { Fragment, useEffect, useState } from "react";
import BoxFormatStyle, { bfClass } from "./BoxFormatStyle";

// `fit`: "cover" (default, fills the box and crops as needed — used for
// full-bleed photo bands) or "contain" (never crops or stretches; the whole
// photo always stays inside the box, keeping its original proportions,
// with `bgClass` filling any leftover space behind it).
//
// `itemFormats` (optional): array parallel to `images`, one
// { manual, zoom, objectPositionX, objectPositionY, tabletPortrait: {...},
// tabletLandscape: {...}, mobilePortrait: {...}, mobileLandscape: {...},
// wide: {...} } object per photo. When an image has `manual: true`, it
// ignores `fit` and instead renders zoomed/positioned exactly as configured
// in the admin (cover + custom zoom + custom focal point) — this is the
// per-photo "zoom and place it however I want" override. The zoom/position
// can be set independently per device (same 6-context engine used
// everywhere else), driven through the box-format CSS engine instead of a
// fixed inline style, so it can actually vary by breakpoint.
// `idPrefix` gives each photo's generated CSS class a stable, unique name —
// required (and must be unique on the page) whenever any item has manual crop.
export default function Gallery({ images, interval = 4000, aspectClass = "aspect-[4/3]", fit = "cover", bgClass = "bg-black/[0.04]", itemFormats = [], idPrefix = "gallery" }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!images || images.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative overflow-hidden border border-black/10 ${fit === "contain" ? bgClass : ""} ${aspectClass}`}>
      {images.map((src, i) => {
        const f = itemFormats[i] || {};
        const manual = !!f.manual;
        const boxId = `${idPrefix}-${i}`;
        return (
          <Fragment key={src + i}>
            {manual && <BoxFormatStyle id={boxId} format={f} />}
            <img
              src={src}
              alt=""
              className={`absolute inset-0 w-full h-full ${manual ? `object-cover ${bfClass(boxId)}` : fit === "contain" ? "object-contain" : "object-cover"} transition-opacity duration-1000 ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
            />
          </Fragment>
        );
      })}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Imagen ${i + 1}`}
              className={`h-1.5 transition-all ${i === idx ? "w-6 bg-accent" : "w-1.5 bg-white/60"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
