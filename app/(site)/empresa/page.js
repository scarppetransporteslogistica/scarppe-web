import { getContent } from "@/lib/db";
import Gallery from "@/components/Gallery";
import SectionTag from "@/components/SectionTag";
import Reveal from "@/components/Reveal";
import TextFormatStyle from "@/components/TextFormatStyle";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { pages } = getContent();
  return { title: pages.empresa.seo.title, description: pages.empresa.seo.description };
}

export default function EmpresaPage() {
  const { pages } = getContent();
  const e = pages.empresa;
  const fmt = e.formats || {};

  return (
    <>
      <section style={{ background: "#191D33" }} className="py-20">
        <div className="max-w-container mx-auto px-6 lg:px-10">
          <Reveal>
            <SectionTag id="empresa-hero" label={e.eyebrow || "Empresa"} light labelFormat={fmt.eyebrow} />
            <TextFormatStyle id="empresa-hero-titulo" format={fmt.heroTitulo} />
            <h1 className="tf-empresa-hero-titulo font-heading text-4xl md:text-5xl font-extrabold uppercase text-white leading-tight max-w-2xl">
              {e.heroTitulo || "Una empresa familiar con más de 80 años de trayectoria"}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Historia: primero, texto a lo ancho y la foto grande debajo, bien visual */}
      <section className="max-w-container mx-auto px-6 lg:px-10 py-24">
        <Reveal className="mb-12">
          <SectionTag id="empresa-historia" label={e.historia.titulo} labelFormat={fmt.historiaTitulo} />
          <TextFormatStyle id="empresa-historia-texto" format={fmt.historiaTexto} />
          <p className="tf-empresa-historia-texto font-body text-black/65 leading-relaxed whitespace-pre-line text-lg">{e.historia.texto}</p>
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
            <TextFormatStyle id="empresa-mision-titulo" format={fmt.misionTitulo} />
            <h3 className="tf-empresa-mision-titulo font-heading text-2xl font-extrabold uppercase text-white mb-4">{e.misionTitulo || "Misión"}</h3>
            <TextFormatStyle id="empresa-mision-texto" format={fmt.misionTexto} />
            <p className="tf-empresa-mision-texto font-body font-light text-light leading-relaxed">{e.mision}</p>
          </Reveal>
          <Reveal delay={100} className="p-10 rounded-sm shadow-sm" style={{ background: "#191D33" }}>
            <TextFormatStyle id="empresa-vision-titulo" format={fmt.visionTitulo} />
            <h3 className="tf-empresa-vision-titulo font-heading text-2xl font-extrabold uppercase text-white mb-4">{e.visionTitulo || "Visión"}</h3>
            <TextFormatStyle id="empresa-vision-texto" format={fmt.visionTexto} />
            <p className="tf-empresa-vision-texto font-body font-light text-light leading-relaxed">{e.vision}</p>
          </Reveal>
        </div>
      </section>

      <section className="max-w-container mx-auto px-6 lg:px-10 pt-20 md:pt-28 pb-28">
        <Reveal className="mb-12">
          <SectionTag id="empresa-valores" label={e.valoresTitulo || "Nuestros Valores"} labelFormat={fmt.valoresTitulo} />
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {e.valores.map((v, i) => {
            const vfmt = v.formats || {};
            return (
              <Reveal key={v.nombre} delay={i * 80} className="bg-white border border-black/10 p-7 text-center">
                <TextFormatStyle id={`empresa-valor-${i}-nombre`} format={vfmt.nombre} />
                <h4 className={`tf-empresa-valor-${i}-nombre font-heading font-bold uppercase tracking-wide text-tertiary mb-2`}>{v.nombre}</h4>
                <TextFormatStyle id={`empresa-valor-${i}-descripcion`} format={vfmt.descripcion} />
                <p className={`tf-empresa-valor-${i}-descripcion font-body text-sm text-black/60 leading-relaxed`}>{v.descripcion}</p>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
