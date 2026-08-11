"use client";
import { useEffect, useState } from "react";
import TextFormatStyle from "./TextFormatStyle";
import BoxFormatStyle, { bfClass } from "./BoxFormatStyle";
import { heroGradientCSS } from "@/lib/textFormat";

// Scales just the alpha channel of an "rgba(r,g,b,a)" string by `factor`,
// clamped to a valid 0-1 range. Used to let the admin lighten or darken the
// banner's photo overlay without having to know CSS.
function scaleAlpha(rgba, factor) {
  return rgba.replace(/rgba\(([^,]+),([^,]+),([^,]+),\s*([\d.]+)\)/, (_, r, g, b, a) => {
    const next = Math.max(0, Math.min(1, parseFloat(a) * factor));
    return `rgba(${r.trim()},${g.trim()},${b.trim()},${next})`;
  });
}

export default function Hero({ images, video, title, subtitle, text, textScale, overlayScale, gradient, formats = {} }) {
  const [idx, setIdx] = useState(0);
  const list = images && images.length > 0 ? images : [];

  useEffect(() => {
    if (video || list.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % list.length), 5000);
    return () => clearInterval(t);
  }, [video, list.length]);

  const scale = (Number(textScale) || 100) / 100;
  const overlay = (Number(overlayScale) || 100) / 100;
  // Which original default layer a given device context corresponds to —
  // used so a custom gradient set on ONE device only hides/replaces ITS OWN
  // layer, never the others.
  const gradientHideSelectors = {
    mobilePortrait: ".hero-ov-mobile",
    mobileLandscape: ".hero-ov-mobile",
    tabletPortrait: ".hero-ov-td",
    tabletLandscape: ".hero-ov-td",
    desktop: ".hero-ov-td",
    wide: ".hero-ov-td",
  };
  const gradientCSS = heroGradientCSS("hero-gradient-custom", gradient, gradientHideSelectors);

  return (
    <section
      className="relative min-h-[600px] sm:min-h-[660px] tablet:min-h-0 tablet:h-auto landscapeShort:min-h-0 landscapeShort:h-auto desktop:min-h-[88vh] flex overflow-hidden bg-primary"
      style={{ "--hero-text-scale": scale }}
    >
      <div className="absolute inset-0">
        {video ? (
          <video className="w-full h-full object-cover object-center" src={video} autoPlay muted loop playsInline />
        ) : (
          <>
            <BoxFormatStyle id="inicio-hero-imagen" format={formats.heroImagenFoco} />
            {list.map((src, i) => (
              <img
                key={src + i}
                src={src}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover object-[70%_center] tablet:object-[58%_center] desktop:object-center ${bfClass("inicio-hero-imagen")} transition-opacity duration-[2000ms] ease-in-out ${
                  i === idx ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </>
        )}

        {/* Original hand-tuned defaults — ALWAYS rendered. A custom gradient
            configured for one device only hides/replaces its own layer via
            CSS below (see gradientCSS); every other device's default here
            stays exactly as it was, untouched. */}
        {/* Mobile: text spans nearly the full width, so a stronger, more uniform scrim keeps contrast high without flattening the photo */}
        <div
          className="hero-ov-mobile absolute inset-0 tablet:hidden desktop:hidden landscapeShort:!block"
          style={{
            background: `linear-gradient(180deg, ${scaleAlpha("rgba(13,16,32,0.88)", overlay)} 0%, ${scaleAlpha("rgba(13,16,32,0.74)", overlay)} 45%, ${scaleAlpha("rgba(13,16,32,0.88)", overlay)} 100%)`,
          }}
        />
        {/* Tablet/desktop: darkest directly behind the text column, fading out so the central truck and the right-side trailer stay visible */}
        <div
          className="hero-ov-td absolute inset-0 hidden tablet:block desktop:block landscapeShort:!hidden"
          style={{
            background: `linear-gradient(90deg, ${scaleAlpha("rgba(13,16,32,0.9)", overlay)} 0%, ${scaleAlpha("rgba(13,16,32,0.68)", overlay)} 32%, ${scaleAlpha("rgba(13,16,32,0.28)", overlay)} 55%, ${scaleAlpha("rgba(13,16,32,0.06)", overlay)} 78%, rgba(13,16,32,0) 100%)`,
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/4"
          style={{ background: `linear-gradient(to top, ${scaleAlpha("rgba(9,11,24,0.65)", overlay)}, transparent)` }}
        />
        {/* Custom overlay: transparent everywhere by default; the CSS below
            only gives it a background (and hides the matching default layer
            above) for the specific device context(s) the admin configured. */}
        {gradientCSS ? <style dangerouslySetInnerHTML={{ __html: gradientCSS }} /> : null}
        <div className="absolute inset-0 hero-gradient-custom" />
      </div>

      <div className="relative z-[2] w-full flex items-center px-6 sm:px-8 tablet:px-10 desktop:px-[7%] landscapeShort:px-6 pt-14 sm:pt-16 tablet:pt-[72px] landscapeShort:pt-6 desktop:py-0 pb-20 sm:pb-24 tablet:pb-16 landscapeShort:pb-6 desktop:pb-0">
        <div className="w-full tablet:max-w-[58%] landscapeShort:max-w-[560px] desktop:max-w-[min(600px,45%)]">
          <TextFormatStyle id="inicio-hero-eyebrow" format={formats.heroEyebrow} mode="flex" sizeCategory="label-xxs" />
          <p className="tf-inicio-hero-eyebrow font-heading text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-accent mb-4 sm:mb-5 landscapeShort:mb-2 flex items-center gap-2 sm:gap-3">
            <span className="w-5 sm:w-6 h-0.5 bg-accent inline-block shrink-0" />
            Transporte y Logística
          </p>
          <TextFormatStyle id="inicio-hero-titulo" format={formats.heroTitle} sizeCategory="hero-title" />
          <h1 className="hero-title tf-inicio-hero-titulo font-heading font-extrabold uppercase text-white leading-[0.98] sm:leading-[0.95] tracking-tight text-left">
            {title}
          </h1>
          <TextFormatStyle id="inicio-hero-subtitulo" format={formats.heroSubtitle} sizeCategory="hero-subtitle" />
          <p className="hero-subtitle tf-inicio-hero-subtitulo font-heading font-semibold text-white/95 mt-4 sm:mt-5 landscapeShort:mt-2 text-left">{subtitle}</p>
          <TextFormatStyle id="inicio-hero-texto" format={formats.heroText} sizeCategory="hero-text" />
          <p className="hero-text tf-inicio-hero-texto font-body font-light text-light mt-4 sm:mt-6 landscapeShort:mt-2 landscapeShort:leading-snug leading-relaxed text-left">{text}</p>
          <TextFormatStyle id="inicio-hero-ctas" format={formats.heroCtas} mode="flex" sizeCategory="btn" />
          <BoxFormatStyle id="inicio-hero-cta-box" format={formats.heroCtaBox} />
          <div className="tf-inicio-hero-ctas flex mt-8 sm:mt-10 landscapeShort:mt-4">
            <a
              href="#servicios"
              className={`btn-cta ${bfClass("inicio-hero-cta-box")} inline-flex items-center justify-center rounded-sm bg-accent text-primary font-heading font-bold uppercase tracking-[0.2em] px-8 py-4 landscapeShort:py-2.5 hover:brightness-95 transition-all w-full sm:w-auto`}
            >
              Conocer Nuestros Servicios
            </a>
          </div>
        </div>
      </div>

      {list.length > 1 && !video && (
        <div className="absolute z-[2] bottom-6 sm:bottom-8 tablet:bottom-8 desktop:bottom-8 left-6 sm:left-8 tablet:left-10 desktop:left-[7%] flex items-center gap-2">
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
