import { getContent } from "@/lib/db";
import SectionTag from "@/components/SectionTag";
import Reveal from "@/components/Reveal";
import Gallery from "@/components/Gallery";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { pages } = getContent();
  return { title: pages.comercioExterior.seo.title, description: pages.comercioExterior.seo.description };
}

export default function ComercioExteriorPage() {
  const { pages } = getContent();
  const c = pages.comercioExterior;

  return (
    <section style={{ background: "#D9E8F5" }} className="py-24">
      <div className="max-w-container mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-start">
        <div>
          <Reveal>
            <SectionTag label={c.eyebrow || "Comercio Exterior"} title={c.titulo} />
            <p className="font-body text-black/65 leading-relaxed text-lg mb-8">{c.intro}</p>
          </Reveal>

          <Reveal delay={80} className="border-l-4 border-tertiary bg-white/60 p-5 mb-10">
            <p className="font-body text-primary/85 text-sm leading-relaxed">
              <span className="font-heading font-bold uppercase text-xs tracking-wide text-tertiary block mb-1">Importante</span>
              {c.aviso}
            </p>
          </Reveal>

          {c.gallery && c.gallery.length > 0 && (
            <Reveal delay={90} className="mb-10">
              <Gallery images={c.gallery} />
            </Reveal>
          )}

          <div className="flex flex-col">
            {c.bloques.map((b, i) => (
              <Reveal
                key={b.titulo}
                delay={i * 90}
                className="group flex gap-5 py-6 px-3 -mx-3 border-t border-black/10 last:border-b hover:bg-white/60 rounded-sm transition-colors"
              >
                <span className="font-heading text-3xl font-extrabold text-accent leading-none min-w-[2.5rem] group-hover:scale-110 transition-transform">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold uppercase tracking-wide text-primary mb-1.5">{b.titulo}</h3>
                  <p className="font-body text-sm text-black/60 leading-relaxed">{b.texto}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={100} style={{ background: "#191D33" }} className="p-10 md:sticky md:top-28">
          <h3 className="font-heading text-2xl font-extrabold uppercase text-white mb-5">¿Necesitás coordinar una operación?</h3>
          <p className="font-body font-light text-light leading-relaxed mb-8">
            Contactanos y te ayudamos a coordinar tu importación o exportación de principio a fin.
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center justify-center rounded-sm bg-accent text-primary font-heading text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 hover:brightness-95 transition-all"
          >
            Solicitar Cotización
          </a>
        </Reveal>
      </div>
    </section>
  );
}
