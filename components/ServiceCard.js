import Link from "next/link";
import ServiceIcon from "./ServiceIcon";

export default function ServiceCard({ servicio, index = 0 }) {
  return (
    <Link
      href={`/servicios/${servicio.slug}`}
      className="group relative block bg-white p-10 border border-black/10 overflow-hidden hover:bg-primary transition-colors"
    >
      <span
        className="absolute top-3 right-5 font-heading font-extrabold leading-none select-none pointer-events-none transition-colors"
        style={{
          fontSize: "80px",
          WebkitTextStroke: "1px rgba(25,29,51,0.08)",
          color: "transparent",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <ServiceIcon slug={servicio.slug} className="w-11 h-11 text-tertiary group-hover:text-accent transition-colors mb-7 relative" />
      <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-primary group-hover:text-white transition-colors mb-3 relative">
        {servicio.nombre}
      </h3>
      <p className="font-body text-sm text-black/60 group-hover:text-light leading-relaxed line-clamp-3 relative transition-colors">
        {servicio.resumen}
      </p>
      <span className="inline-flex items-center gap-2 text-tertiary group-hover:text-accent font-heading text-xs font-bold uppercase tracking-wide mt-5 relative transition-colors">
        Ver más
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
