import { getContent } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ServiceIcon from "@/components/ServiceIcon";
import ServicioGallery from "@/components/ServicioGallery";
import TextFormatStyle from "@/components/TextFormatStyle";

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
  const { pages, servicios } = getContent();
  const servicio = servicios.find((s) => s.slug === params.slug);
  if (!servicio) notFound();

  const otros = servicios.filter((s) => s.slug !== params.slug).slice(0, 4);
  const sfmt = servicio.formats || {};
  const pfmt = pages.servicios.formats || {};

  return (
    <>
      <section
        className="relative py-10 sm:py-14 md:py-24 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #191D33 0%, #04325A 100%)" }}
      >
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-60" />
        <div className="relative max-w-container mx-auto px-4 sm:px-6 lg:px-10">
          <Link href="/servicios" className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-light hover:text-white transition-colors">
            ← Volver a Servicios
          </Link>
          <div className="flex items-center gap-5 mt-6">
            <ServiceIcon slug={servicio.slug} className="w-12 h-12 text-accent shrink-0" />
            <TextFormatStyle id={`servicio-${servicio.slug}-nombre`} format={sfmt.nombre} sizeCategory="heading-5xl" />
            <h1 className={`tf-servicio-${servicio.slug}-nombre font-heading text-3xl md:text-5xl font-extrabold uppercase text-white`}>{servicio.nombre}</h1>
          </div>
        </div>
      </section>

      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 md:py-20 grid md:grid-cols-3 gap-8 sm:gap-10 md:gap-14">
        <Reveal className="md:col-span-2">
          <ServicioGallery images={servicio.imagenes || (servicio.imagen ? [servicio.imagen] : [])} />
          <TextFormatStyle id={`servicio-${servicio.slug}-texto`} format={sfmt.texto} sizeCategory="body-lg" />
          <p className={`tf-servicio-${servicio.slug}-texto font-body text-black/70 leading-relaxed whitespace-pre-line text-lg mt-8`}>{servicio.texto}</p>
          <TextFormatStyle id="servicios-detalle-cta" format={pfmt.detailCta} sizeCategory="btn" />
          <div className={`tf-servicios-detalle-cta mt-8`}>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-sm bg-secondary text-white font-heading font-bold uppercase tracking-[0.2em] px-8 py-4 hover:bg-tertiary transition-colors btn-cta"
            >
              Solicitar Cotización
            </Link>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="border border-black/10 p-6">
            <TextFormatStyle id="servicios-otros-titulo" format={pfmt.otrosTitulo} sizeCategory="heading-xs" />
            <h3 className="tf-servicios-otros-titulo font-heading text-xs font-bold uppercase tracking-[0.2em] text-tertiary mb-5">Otros servicios</h3>
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
