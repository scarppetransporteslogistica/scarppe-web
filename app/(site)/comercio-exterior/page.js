import { getContent } from "@/lib/db";
import SectionTag from "@/components/SectionTag";
import Reveal from "@/components/Reveal";
import TextFormatStyle from "@/components/TextFormatStyle";

export const dynamic = "force-dynamic";

const DEFAULT_TARJETAS = [
  { titulo: "Coordinación documental", texto: "Seguimiento y coordinación de la documentación requerida para cada operación." },
  { titulo: "Depósitos fiscales", texto: "Gestión y coordinación de operaciones vinculadas a depósitos fiscales." },
  { titulo: "Seguimiento de la operación", texto: "Acompañamiento durante todo el proceso hasta su finalización." },
];

export async function generateMetadata() {
  const { pages } = getContent();
  return { title: pages.comercioExterior.seo.title, description: pages.comercioExterior.seo.description };
}

export default function ComercioExteriorPage() {
  const { pages } = getContent();
  const c = pages.comercioExterior;
  const fmt = c.formats || {};
  const heroImage = c.heroImage || (c.gallery && c.gallery[0]) || "/uploads/servicio-aduana.jpg";
  const tarjetas = c.tarjetas && c.tarjetas.length > 0 ? c.tarjetas : DEFAULT_TARJETAS;

  return (
    <section style={{ background: "#D9E8F5" }} className="py-10 sm:py-14 md:py-24">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-10 grid md:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-start">
        <div>
          <Reveal>
            <SectionTag id="comercio-hero" label={c.eyebrow || "Comercio Exterior"} title={c.titulo} labelFormat={fmt.eyebrow} titleFormat={fmt.titulo} />
            <TextFormatStyle id="comercio-intro" format={fmt.intro} />
            <p className="tf-comercio-intro font-body text-black/65 leading-relaxed text-lg mb-8">{c.intro}</p>
          </Reveal>

          <Reveal delay={80} className="border-l-4 border-tertiary bg-white/60 p-5 mb-10">
            <TextFormatStyle id="comercio-aviso" format={fmt.aviso} />
            <p className="tf-comercio-aviso font-body text-primary/85 text-sm leading-relaxed">
              <span className="font-heading font-bold uppercase text-xs tracking-wide text-tertiary block mb-1">Importante</span>
              {c.aviso}
            </p>
          </Reveal>

          <div className="flex flex-col">
            {c.bloques.map((b, i) => {
              const bfmt = b.formats || {};
              return (
                <Reveal
                  key={b.titulo}
                  delay={i * 90}
                  className="group flex gap-5 py-6 px-3 -mx-3 border-t border-black/10 last:border-b hover:bg-white/60 rounded-sm transition-colors"
                >
                  <span className="font-heading text-3xl font-extrabold text-accent leading-none min-w-[2.5rem] group-hover:scale-110 transition-transform">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <TextFormatStyle id={`comercio-bloque-${i}-titulo`} format={bfmt.titulo} />
                    <h3 className={`tf-comercio-bloque-${i}-titulo font-heading text-base font-bold uppercase tracking-wide text-primary mb-1.5`}>{b.titulo}</h3>
                    <TextFormatStyle id={`comercio-bloque-${i}-texto`} format={bfmt.texto} />
                    <p className={`tf-comercio-bloque-${i}-texto font-body text-sm text-black/60 leading-relaxed`}>{b.texto}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Visual column: one large photograph, small floating info cards, and the CTA integrated as an overlapping card at the bottom */}
        <Reveal delay={100} className="relative md:sticky md:top-28">
          <div className="relative aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-sm shadow-xl">
            <img src={heroImage} alt="Operación de comercio exterior Scarppe" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/5 to-black/10" />

            {/* Floating info cards, overlapping the top of the photo */}
            <div className="absolute top-5 left-5 right-5 sm:right-auto sm:w-[72%] flex flex-col gap-2.5 sm:gap-3">
              {tarjetas.slice(0, 3).map((t, i) => (
                <div
                  key={t.titulo}
                  className="bg-white/95 backdrop-blur-sm rounded-sm px-4 py-3 shadow-lg flex items-start gap-3"
                >
                  <span className="font-heading text-lg font-extrabold text-accent leading-none shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-heading text-xs font-bold uppercase tracking-wide text-primary leading-tight">{t.titulo}</p>
                    <p className="font-body text-xs text-primary/60 leading-snug mt-1 line-clamp-2">{t.texto}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA integrated as a card overlapping the bottom of the photo, not an isolated box */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <div className="bg-primary/95 backdrop-blur-sm rounded-sm p-6">
                <TextFormatStyle id="comercio-cta-titulo" format={fmt.ctaTitulo} />
                <h3 className="tf-comercio-cta-titulo font-heading text-lg sm:text-xl font-extrabold uppercase text-white mb-2">¿Necesitás coordinar una operación?</h3>
                <TextFormatStyle id="comercio-cta-texto" format={fmt.ctaTexto} />
                <p className="tf-comercio-cta-texto font-body font-light text-light text-sm leading-relaxed mb-4">
                  Contactanos y te ayudamos a coordinar tu importación o exportación de principio a fin.
                </p>
                <TextFormatStyle id="comercio-cta-boton" format={fmt.ctaBoton} />
                <div className="tf-comercio-cta-boton">
                  <a
                    href="/contacto"
                    className="btn-cta inline-flex items-center justify-center rounded-sm bg-accent text-primary font-heading font-bold uppercase tracking-[0.2em] px-6 py-3 hover:brightness-95 transition-all w-full sm:w-auto"
                  >
                    Solicitar Cotización
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
