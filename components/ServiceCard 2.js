"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ServiceIcon from "./ServiceIcon";
import TextFormatStyle from "./TextFormatStyle";
import BoxFormatStyle, { bfClass } from "./BoxFormatStyle";

export default function ServiceCard({ servicio, index = 0 }) {
  const images = servicio.imagenes && servicio.imagenes.length > 0 ? servicio.imagenes : [servicio.imagen];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 3500 + index * 300);
    return () => clearInterval(t);
  }, [images.length, index]);

  return (
    <>
    <BoxFormatStyle id={`servicio-${servicio.slug}-box`} format={servicio.formats?.box} />
    <Link
      href={`/servicios/${servicio.slug}`}
      className={`group relative flex h-full flex-col bg-white p-5 sm:p-6 md:p-10 border border-black/10 overflow-hidden hover:bg-primary transition-colors ${bfClass(`servicio-${servicio.slug}-box`)}`}
    >
      <span
        className="absolute top-2 right-3 sm:top-3 sm:right-5 font-heading font-extrabold leading-none select-none pointer-events-none transition-opacity opacity-25 group-hover:opacity-40 text-[36px] sm:text-[52px] md:text-[80px]"
        style={{ color: "var(--color-service-number, #193F73)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 mb-3 sm:mb-4 md:mb-7">
        <div className="absolute -inset-3 rounded-full overflow-hidden opacity-0 group-hover:opacity-20 transition-opacity">
          {images.map((src, i) => (
            <img key={src + i} src={src} alt="" className={`absolute inset-0 w-full h-full object-cover ${i === idx ? "block" : "hidden"}`} />
          ))}
        </div>
        <ServiceIcon slug={servicio.slug} className="w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 text-tertiary group-hover:text-accent transition-colors relative" />
      </div>
      <TextFormatStyle id={`servicio-${servicio.slug}-nombre`} format={servicio.formats?.nombre} sizeCategory="heading-xl" />
      <h3 className={`tf-servicio-${servicio.slug}-nombre font-heading text-base sm:text-lg md:text-xl font-bold uppercase tracking-wide text-primary group-hover:text-white transition-colors mb-1.5 sm:mb-2 md:mb-3 relative`}>
        {servicio.nombre}
      </h3>
      <TextFormatStyle id={`servicio-${servicio.slug}-resumen`} format={servicio.formats?.resumen} sizeCategory="body-sm" />
      <p className={`tf-servicio-${servicio.slug}-resumen font-body text-sm text-black/60 group-hover:text-light leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-3 relative transition-colors`}>
        {servicio.resumen}
      </p>
      <TextFormatStyle id={`servicio-${servicio.slug}-cta`} format={servicio.formats?.cta} mode="flex" sizeCategory="heading-xs" />
      <span className={`tf-servicio-${servicio.slug}-cta inline-flex items-center gap-2 text-tertiary group-hover:text-accent font-heading text-xs font-bold uppercase tracking-wide mt-auto pt-3 sm:pt-4 md:pt-5 relative transition-colors`}>
        Ver más
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
    </>
  );
}
