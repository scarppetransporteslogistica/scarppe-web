import { getContent } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ServiceIcon from "@/components/ServiceIcon";
import ServicioGallery from "@/components/ServicioGallery";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { servicios } = getContent();
  const servicio = servicios.find((s) => s.slug === params.slug);
  if (!servicio) return {};
  return {
    title: `${servicio.nombre} | Scarppe Transporte y Logística`,
    description: servicio.resumen,
  };
}

export default function ServicioPage({ params }) {
  const { servicios } = getContent();
  const servicio = servicios.find((s) => s.slug === params.slug);
  if (!servicio) notFound();

  const otros = servicios.filter((s) => s.slug !== params.slug).slice(0, 4);

  return (
    <>
      <section
        className="relative py-24 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #191D33 0%, #04325A 100%)" }}
      >
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-60" />
        <div className="relative max-w-container mx-auto px-6 lg:px-10">
          <Link href="/servicios" className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-light hover:text-white transition-colors">
            ← Volver a Servicios
          </Link>
          <div className="flex items-center gap-5 mt-6">
            <ServiceIcon slug={servicio.slug} className="w-12 h-12 text-accent shrink-0" />
            <h1 className="font-heading text-3xl md:text-5xl font-extrabold uppercase text-white">{servicio.nombre}</h1>
          </div>
        </div>
      </section>

      <section className="max-w-container mx-auto px-6 lg:px-10 py-20 grid md:grid-cols-3 gap-14">
        <Reveal className="md:col-span-2">
          <ServicioGallery images={servicio.imagenes || (servicio.imagen ? [servicio.imagen] : [])} />
          <p className="font-body text-black/70 leading-relaxed whitespace-pre-line text-lg mt-8">{servicio.texto}</p>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center rounded-sm bg-secondary text-white font-heading text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 hover:bg-tertiary transition-colors mt-8"
          >
            Solicitar Cotización
          </Link>
        </Reveal>
        <Reveal delay={120}>
          <div className="border border-black/10 p-6">
            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-tertiary mb-5">Otros servicios</h3>
            <div className="space-y-1">
              {otros.map((s) => (
                <Link
                  key={s.slug}
                  href={`/servicios/${s.slug}`}
                  className="block font-body text-sm text-black/70 hover:text-accent py-2 border-b border-black/5 last:border-0"
                >
                  {s.nombre}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
