import { getContent } from "@/lib/db";
import Reveal from "@/components/Reveal";
import SectionTag from "@/components/SectionTag";
import MapEmbed from "@/components/MapEmbed";
import QuoteForm from "@/components/QuoteForm";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { pages } = getContent();
  return { title: pages.contacto.seo.title, description: pages.contacto.seo.description };
}

export default function ContactoPage() {
  const { pages } = getContent();
  const c = pages.contacto;

  return (
    <>
      <section style={{ background: "#191D33" }} className="py-24">
        <div className="max-w-container mx-auto px-6 lg:px-10 grid lg:grid-cols-[1fr_1.4fr] gap-16">
          <Reveal>
            <SectionTag label={c.eyebrow || "Contacto"} light title={c.heroTitulo || "Hablemos de tu operación"} />
            <p className="font-body font-light text-light leading-relaxed mb-10">
              Completá el formulario o comunicate directamente con nosotros. Te respondemos a la brevedad.
            </p>
            <div className="flex flex-col">
              {c.directores.map((d) => (
                <div key={d.nombre} className="border-t border-white/10 py-5 first:border-t-0">
                  <p className="font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-accent mb-1">Director</p>
                  <p className="font-body text-white">{d.nombre} — {d.telefono}</p>
                </div>
              ))}
              <div className="border-t border-white/10 py-5">
                <p className="font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-accent mb-1">Gerencia</p>
                <p className="font-body text-white">{c.gerencia}</p>
              </div>
              <div className="border-t border-b border-white/10 py-5">
                <p className="font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-accent mb-1">Logística</p>
                <p className="font-body text-white">{c.logistica}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-accent mb-5">Formulario de Cotización</p>
            <QuoteForm />
          </Reveal>
        </div>
      </section>

      <section className="max-w-container mx-auto px-6 lg:px-10 py-24">
        <Reveal className="mb-12">
          <SectionTag label={c.oficinasEyebrow || "Oficinas"} title={c.oficinasTitulo || "Nuestras Oficinas"} />
        </Reveal>
        <div className="grid md:grid-cols-2 gap-10">
          {c.mapas.map((m, i) => (
            <Reveal key={m.pais} delay={i * 100}>
              <p className="font-heading text-lg font-bold uppercase tracking-wide text-primary mb-1">{m.pais}</p>
              <p className="font-body text-sm text-black/60 mb-4">{m.direccion}</p>
              <MapEmbed lat={m.lat} lng={m.lng} label={m.pais} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
