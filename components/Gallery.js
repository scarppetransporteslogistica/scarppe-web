"use client";
import { useEffect, useState } from "react";

// `fit`: "cover" (default, fills the box and crops as needed — used for
// full-bleed photo bands) or "contain" (never crops or stretches; the whole
// photo always stays inside the box, keeping its original proportions,
// with `bgClass` filling any leftover space behind it).
export default function Gallery({ images, interval = 4000, aspectClass = "aspect-[4/3]", fit = "cover", bgClass = "bg-black/[0.04]" }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!images || images.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative overflow-hidden border border-black/10 ${fit === "contain" ? bgClass : ""} ${aspectClass}`}>
      {images.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt=""
          className={`absolute inset-0 w-full h-full ${fit === "contain" ? "object-contain" : "object-cover"} transition-opacity duration-1000 ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
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
