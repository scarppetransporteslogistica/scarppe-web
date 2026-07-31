"use client";
import { useEffect, useState } from "react";
import TextFormatStyle from "./TextFormatStyle";

export default function Hero({ images, video, title, subtitle, text, textScale, formats = {} }) {
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
      className="relative min-h-[500px] sm:min-h-[560px] tablet:min-h-0 tablet:h-auto desktop:min-h-[88vh] flex overflow-hidden bg-primary"
      style={{ "--hero-text-scale": scale }}
    >
      <div className="absolute inset-0">
        {video ? (
          <video className="w-full h-full object-cover object-center" src={video} autoPlay muted loop playsInline />
        ) : (
          list.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover object-[64%_center] tablet:object-[58%_center] desktop:object-center transition-opacity duration-[2000ms] ease-in-out ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
            />
          ))
        )}

        {/* Mobile: text spans nearly the full width, so a more uniform, slightly stronger scrim keeps it legible */}
        <div
          className="absolute inset-0 tablet:hidden desktop:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,16,32,0.84) 0%, rgba(13,16,32,0.68) 45%, rgba(13,16,32,0.82) 100%)",
          }}
        />
        {/* Tablet/desktop: darkest directly behind the text column, fading out so the central truck and the right-side trailer stay visible */}
        <div
          className="absolute inset-0 hidden tablet:block desktop:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(13,16,32,0.9) 0%, rgba(13,16,32,0.68) 32%, rgba(13,16,32,0.28) 55%, rgba(13,16,32,0.06) 78%, rgba(13,16,32,0) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/4"
          style={{ background: "linear-gradient(to top, rgba(9,11,24,0.6), transparent)" }}
        />
      </div>

      <div className="relative z-[2] w-full flex items-center px-5 sm:px-6 tablet:px-10 desktop:px-[7%] py-12 sm:py-14 tablet:pt-[72px] tablet:pb-16 desktop:py-0 pb-12 sm:pb-14 tablet:pb-16 desktop:pb-0">
        <div className="w-full tablet:max-w-[58%] desktop:max-w-[min(600px,45%)]">
          <p className="font-heading text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-accent mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3">
            <span className="w-5 sm:w-6 h-0.5 bg-accent inline-block" />
            Transporte y Logística
          </p>
          <TextFormatStyle id="inicio-hero-titulo" format={formats.heroTitle} />
          <h1 className="hero-title tf-inicio-hero-titulo font-heading font-extrabold uppercase text-white leading-[0.98] sm:leading-[0.95] tracking-tight">
            {title}
          </h1>
          <TextFormatStyle id="inicio-hero-subtitulo" format={formats.heroSubtitle} />
          <p className="hero-subtitle tf-inicio-hero-subtitulo font-heading font-semibold text-white/95 mt-2.5 sm:mt-4">{subtitle}</p>
          <TextFormatStyle id="inicio-hero-texto" format={formats.heroText} />
          <p className="hero-text tf-inicio-hero-texto font-body font-light text-light mt-3 sm:mt-5 leading-snug sm:leading-relaxed">{text}</p>
          <TextFormatStyle id="inicio-hero-ctas" format={formats.heroCtas} mode="flex" />
          <div className="tf-inicio-hero-ctas flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-9">
            <a
              href="/contacto"
              className="btn-cta inline-flex items-center justify-center rounded-sm bg-accent text-primary font-heading font-bold uppercase tracking-[0.2em] px-6 py-3 sm:px-8 sm:py-4 hover:brightness-95 transition-all w-full sm:w-auto"
            >
              Solicitar Cotización
            </a>
            <a
              href="/servicios"
              className="btn-cta inline-flex items-center justify-center rounded-sm border border-white/30 text-white font-heading font-bold uppercase tracking-[0.2em] px-6 py-3 sm:px-8 sm:py-4 hover:bg-white/10 transition-colors w-full sm:w-auto whitespace-nowrap"
            >
              <span className="sm:hidden">Ver Servicios</span>
              <span className="hidden sm:inline">Conocer Nuestros Servicios</span>
            </a>
          </div>
        </div>
      </div>

      {list.length > 1 && !video && (
        <div className="absolute z-[2] bottom-4 sm:bottom-6 tablet:bottom-8 desktop:bottom-8 left-5 sm:left-6 tablet:left-10 desktop:left-[7%] flex items-center gap-2">
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
