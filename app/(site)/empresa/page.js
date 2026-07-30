import { getContent } from "@/lib/db";
import Gallery from "@/components/Gallery";
import SectionTag from "@/components/SectionTag";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { pages } = getContent();
  return { title: pages.empresa.seo.title, description: pages.empresa.seo.description };
}

export default function EmpresaPage() {
  const { pages } = getContent();
  const e = pages.empresa;

  return (
    <>
      <section style={{ background: "#191D33" }} className="py-20">
        <div className="max-w-container mx-auto px-6 lg:px-10">
          <Reveal>
            <SectionTag label={e.eyebrow || "Empresa"} light />
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold uppercase text-white leading-tight max-w-2xl">
              {e.heroTitulo || "Una empresa familiar con más de 80 años de trayectoria"}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Historia: primero, texto a lo ancho y la foto grande debajo, bien visual */}
      <section className="max-w-container mx-auto px-6 lg:px-10 py-24">
        <Reveal className="mb-12">
          <SectionTag label={e.historia.titulo} />
          <p className="font-body text-black/65 leading-relaxed whitespace-pre-line text-lg">{e.historia.texto}</p>
        </Reveal>
        <Reveal delay={120}>
          <Gallery
            images={e.historia.gallery && e.historia.gallery.length > 0 ? e.historia.gallery : e.historia.timeline.map((t) => t.imagen)}
            aspectClass="aspect-[16/10] md:aspect-[2/1]"
          />
        </Reveal>
      </section>

      <section className="max-w-container mx-auto px-6 lg:px-10 pt-24 pb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <Reveal className="p-10 rounded-sm shadow-sm" style={{ background: "#04325A" }}>
            <h3 className="font-heading text-2xl font-extrabold uppercase text-white mb-4">{e.misionTitulo || "Misión"}</h3>
            <p className="font-body font-light text-light leading-relaxed">{e.mision}</p>
          </Reveal>
          <Reveal delay={100} className="p-10 rounded-sm shadow-sm" style={{ background: "#191D33" }}>
            <h3 className="font-heading text-2xl font-extrabold uppercase text-white mb-4">{e.visionTitulo || "Visión"}</h3>
            <p className="font-body font-light text-light leading-relaxed">{e.vision}</p>
          </Reveal>
        </div>
      </section>

      <section className="max-w-container mx-auto px-6 lg:px-10 pt-20 md:pt-28 pb-28">
        <Reveal className="mb-12">
          <SectionTag label={e.valoresTitulo || "Nuestros Valores"} />
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {e.valores.map((v, i) => (
            <Reveal key={v.nombre} delay={i * 80} className="bg-white border border-black/10 p-7 text-center">
              <h4 className="font-heading font-bold uppercase tracking-wide text-tertiary mb-2">{v.nombre}</h4>
              <p className="font-body text-sm text-black/60 leading-relaxed">{v.descripcion}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
