"use client";
import { useEffect, useState } from "react";
import { useSwipe } from "./useSwipe";

export default function ServicioGallery({ images = [] }) {
  const list = (images || []).filter(Boolean);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (list.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % list.length), 4000);
    return () => clearInterval(t);
    // Depending on `idx` too means a manual swipe/dot click resets the
    // countdown, so that photo gets a full viewing window before it
    // auto-advances again.
  }, [list.length, idx]);

  const swipe = useSwipe({
    onSwipeLeft: () => setIdx((i) => (i + 1) % list.length),
    onSwipeRight: () => setIdx((i) => (i - 1 + list.length) % list.length),
  });

  if (list.length === 0) return null;

  return (
    <div className="relative w-full h-72 md:h-[420px] overflow-hidden border border-black/10 touch-pan-y" {...(list.length > 1 ? swipe : {})}>
      {list.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {list.length > 1 && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
          {list.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Imagen ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-7 bg-accent" : "w-3 bg-white/60"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
