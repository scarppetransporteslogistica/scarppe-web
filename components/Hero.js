"use client";
import { useEffect, useState } from "react";

export default function Hero({ images, video, title, subtitle, text, textScale }) {
  const [idx, setIdx] = useState(0);
  const list = images && images.length > 0 ? images : [];

  useEffect(() => {
    if (video || list.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % list.length), 5000);
    return () => clearInterval(t);
  }, [video, list.length]);

  const scale = (Number(textScale) || 100) / 100;

  return (
    <section
      className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden bg-primary"
      style={{ "--hero-text-scale": scale }}
    >
      <div className="absolute inset-0">
        {video ? (
          <video className="w-full h-full object-cover" src={video} autoPlay muted loop playsInline />
        ) : (
          list.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
            />
          ))
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(25,29,51,0.94) 0%, rgba(25,29,51,0.75) 35%, rgba(25,29,51,0.35) 65%, rgba(4,50,90,0.35) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{ background: "linear-gradient(to top, rgba(13,16,32,0.9), transparent)" }}
        />
      </div>

      <div className="relative z-[2] max-w-container mx-auto w-full px-6 lg:px-10 py-28">
        <div className="max-w-xl">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-5 flex items-center gap-3">
            <span className="w-6 h-0.5 bg-accent inline-block" />
            Transporte y Logística
          </p>
          <h1 className="hero-title font-heading font-extrabold uppercase text-white leading-[0.95] tracking-tight">
            {title}
          </h1>
          <p className="hero-subtitle font-heading font-semibold text-white/90 mt-4">{subtitle}</p>
          <p className="hero-text font-body font-light text-light mt-5 leading-relaxed max-w-md">{text}</p>
          <div className="flex flex-wrap gap-4 mt-9">
            <a
              href="/contacto"
              className="inline-flex items-center justify-center rounded-sm bg-accent text-primary font-heading text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 hover:brightness-95 transition-all"
            >
              Solicitar Cotización
            </a>
            <a
              href="/servicios"
              className="inline-flex items-center justify-center rounded-sm border border-white/30 text-white font-heading text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 hover:bg-white/10 transition-colors"
            >
              Nuestros Servicios
            </a>
          </div>
        </div>
      </div>

      {list.length > 1 && !video && (
        <div className="relative z-[2] flex items-center gap-2 px-6 lg:px-10 pb-8">
          {list.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Imagen ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-accent" : "w-4 bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
