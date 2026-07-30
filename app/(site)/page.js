import { getContent } from "@/lib/db";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import StatsBar from "@/components/StatsBar";
import ServiceCard from "@/components/ServiceCard";
import SectionTag from "@/components/SectionTag";
import Reveal from "@/components/Reveal";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { pages } = getContent();
  return { title: pages.inicio.seo.title, description: pages.inicio.seo.description };
}

export default function InicioPage() {
  const { pages, servicios } = getContent();
  const inicio = pages.inicio;

  return (
    <>
      <Hero
        images={inicio.heroImages || (inicio.heroImage ? [inicio.heroImage] : [])}
        video={inicio.heroVideo}
        title={inicio.heroTitle}
        subtitle={inicio.heroSubtitle}
        text={inicio.heroText}
        textScale={inicio.heroTextScale}
      />
      <TrustStrip items={inicio.badges || []} />
      <StatsBar stats={inicio.stats} valueScale={inicio.statsValueScale} />

      <section className="max-w-container mx-auto px-6 lg:px-10 py-24">
        <div className="flex flex-wrap items-end justify-between gap-8 mb-14">
          <Reveal>
            <SectionTag label={inicio.serviciosEyebrow || "Nuestros Servicios"} title={inicio.serviciosTitulo || "Soluciones logísticas integrales"} />
          </Reveal>
          <Reveal delay={100}>
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.2em] text-tertiary hover:text-accent transition-colors"
            >
              Ver todos los servicios
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </Reveal>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicios.slice(0, 6).map((s, i) => (
            <Reveal key={s.slug} delay={i * 60} className="h-full">
              <ServiceCard servicio={s} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #04325A 0%, #191D33 100%)" }}
      >
        <div className="max-w-container mx-auto px-6 lg:px-10 py-24 grid md:grid-cols-2 gap-14 items-center relative z-10">
          <Reveal>
            <SectionTag label={inicio.trayectoriaEyebrow || "Trayectoria"} light />
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold uppercase text-white leading-tight mb-5">
              Más de 80 años moviendo la carga de Uruguay y Brasil
            </h2>
            <p className="font-body font-light text-light leading-relaxed mb-8">
              {pages.empresa.historia.texto.split("\n\n")[0]}
            </p>
            <Link
              href="/empresa"
              className="inline-flex items-center gap-2 text-white font-heading text-xs font-bold uppercase tracking-[0.2em] hover:text-accent transition-colors"
            >
              Conocer la empresa
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </Reveal>
          <Reveal delay={150}>
            <img
              src={(pages.empresa.historia.gallery && pages.empresa.historia.gallery[0]) || "/uploads/hero-flota.jpg"}
              alt="Historia Scarppe"
              className="w-full h-80 object-cover border border-white/10"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
