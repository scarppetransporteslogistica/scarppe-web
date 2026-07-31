import { getContent } from "@/lib/db";
import Reveal from "@/components/Reveal";
import SectionTag from "@/components/SectionTag";
import MapEmbed from "@/components/MapEmbed";
import QuoteForm from "@/components/QuoteForm";
import TextFormatStyle from "@/components/TextFormatStyle";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { pages } = getContent();
  return { title: pages.contacto.seo.title, description: pages.contacto.seo.description };
}

export default function ContactoPage() {
  const { pages } = getContent();
  const c = pages.contacto;
  const fmt = c.formats || {};

  return (
    <>
      <section style={{ background: "#191D33" }} className="py-10 sm:py-14 md:py-24">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-[1fr_1.4fr] gap-8 sm:gap-10 md:gap-16">
          <Reveal>
            <SectionTag
              id="contacto-hero"
              label={c.eyebrow || "Contacto"}
              light
              title={c.heroTitulo || "Hablemos de tu operación"}
              labelFormat={fmt.eyebrow}
              titleFormat={fmt.heroTitulo}
            />
            <TextFormatStyle id="contacto-intro" format={fmt.introTexto} sizeCategory="body-base" />
            <p className="tf-contacto-intro font-body font-light text-light leading-relaxed mb-10">
              Completá el formulario o comunicate directamente con nosotros. Te respondemos a la brevedad.
            </p>
            <div className="flex flex-col">
              {c.directores.map((d, i) => {
                const dfmt = d.formats || {};
                return (
                  <div key={d.nombre} className="border-t border-white/10 py-5 first:border-t-0">
                    <p className="font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-accent mb-1">Director</p>
                    <TextFormatStyle id={`contacto-director-${i}`} format={dfmt.linea} sizeCategory="body-base" />
                    <p className={`tf-contacto-director-${i} font-body text-white`}>
                      {d.nombre} — {d.telefono}
                    </p>
                  </div>
                );
              })}
              <div className="border-t border-white/10 py-5">
                <p className="font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-accent mb-1">Gerencia</p>
                <TextFormatStyle id="contacto-gerencia" format={fmt.gerencia} sizeCategory="body-base" />
                <p className="tf-contacto-gerencia font-body text-white">{c.gerencia}</p>
              </div>
              <div className="border-t border-b border-white/10 py-5">
                <p className="font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-accent mb-1">Logística</p>
                <TextFormatStyle id="contacto-logistica" format={fmt.logistica} sizeCategory="body-base" />
                <p className="tf-contacto-logistica font-body text-white">{c.logistica}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <TextFormatStyle id="contacto-form-titulo" format={fmt.formTitulo} sizeCategory="heading-xs" />
            <p className="tf-contacto-form-titulo font-heading text-xs font-bold uppercase tracking-[0.25em] text-accent mb-5">Formulario de Cotización</p>
            <QuoteForm />
          </Reveal>
        </div>
      </section>

      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 md:py-24">
        <Reveal className="mb-6 sm:mb-8 md:mb-12">
          <SectionTag
            id="contacto-oficinas"
            label={c.oficinasEyebrow || "Oficinas"}
            title={c.oficinasTitulo || "Nuestras Oficinas"}
            labelFormat={fmt.oficinasEyebrow}
            titleFormat={fmt.oficinasTitulo}
          />
        </Reveal>
        <div className="grid md:grid-cols-2 gap-10">
          {c.mapas.map((m, i) => {
            const mfmt = m.formats || {};
            return (
              <Reveal key={m.pais} delay={i * 100}>
                <TextFormatStyle id={`contacto-oficina-${i}-pais`} format={mfmt.pais} sizeCategory="heading-lg" />
                <p className={`tf-contacto-oficina-${i}-pais font-heading text-lg font-bold uppercase tracking-wide text-primary mb-1`}>{m.pais}</p>
                <TextFormatStyle id={`contacto-oficina-${i}-direccion`} format={mfmt.direccion} sizeCategory="body-sm" />
                <p className={`tf-contacto-oficina-${i}-direccion font-body text-sm text-black/60 mb-4`}>{m.direccion}</p>
                <MapEmbed lat={m.lat} lng={m.lng} label={m.pais} />
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
