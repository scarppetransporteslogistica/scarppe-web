import React from "react";
import { getContent } from "@/lib/db";
import Gallery from "@/components/Gallery";
import SectionTag from "@/components/SectionTag";
import Reveal from "@/components/Reveal";
import TextFormatStyle from "@/components/TextFormatStyle";
import BoxFormatStyle, { bfClass } from "@/components/BoxFormatStyle";

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
      <section style={{ background: "#191D33" }} className="py-10 sm:py-14 md:py-20">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-10">
          <Reveal>
            <SectionTag id="empresa-hero" label={e.eyebrow || "Empresa"} light labelFormat={fmt.eyebrow} />
            <TextFormatStyle id="empresa-hero-titulo" format={fmt.heroTitulo} sizeCategory="heading-4xl" />
            <h1 className="tf-empresa-hero-titulo font-heading text-4xl md:text-5xl font-extrabold uppercase text-white leading-tight max-w-2xl">
              {e.heroTitulo || "Una empresa familiar con más de 80 años de trayectoria"}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Historia: composición editorial en dos columnas — texto a la izquierda,
          fotos a la derecha en un cuadro que siempre iguala la altura del
          texto (si el texto crece, el cuadro crece con él). */}
      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-14 md:items-stretch">
          <Reveal>
            <SectionTag id="empresa-historia" label={e.historia.titulo} labelFormat={fmt.historiaTitulo} />
            <TextFormatStyle id="empresa-historia-texto" format={fmt.historiaTexto} sizeCategory="body-lg" />
            <p className="tf-empresa-historia-texto font-body text-black/65 leading-relaxed whitespace-pre-line text-lg">{e.historia.texto}</p>
          </Reveal>
          <Reveal delay={120} className="flex">
            <Gallery
              images={e.historia.gallery && e.historia.gallery.length > 0 ? e.historia.gallery : e.historia.timeline.map((t) => t.imagen)}
              itemFormats={e.historia.galleryFormats || []}
              aspectClass="aspect-[4/5] sm:aspect-[3/4] md:aspect-auto w-full md:h-full min-h-[320px]"
              fit="contain"
              bgClass="bg-black/[0.04]"
            />
          </Reveal>
        </div>
      </section>

      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 md:pt-24 pb-4 sm:pb-6 md:pb-8">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <BoxFormatStyle id="empresa-mision-box" format={fmt.misionBox} />
          <Reveal className={`p-7 sm:p-10 md:p-16 flex flex-col justify-center rounded-sm shadow-sm ${bfClass("empresa-mision-box")}`} style={{ background: "#04325A" }}>
            <TextFormatStyle id="empresa-mision-titulo" format={fmt.misionTitulo} sizeCategory="heading-xl" />
            <h3 className="tf-empresa-mision-titulo font-heading text-lg sm:text-xl md:text-2xl font-extrabold uppercase text-white mb-2 sm:mb-3 md:mb-4">{e.misionTitulo || "Misión"}</h3>
            <TextFormatStyle id="empresa-mision-texto" format={fmt.misionTexto} sizeCategory="body-base" />
            <p className="tf-empresa-mision-texto font-body font-light text-light leading-normal sm:leading-relaxed text-sm sm:text-base">{e.mision}</p>
          </Reveal>
          <BoxFormatStyle id="empresa-vision-box" format={fmt.visionBox} />
          <Reveal delay={100} className={`p-7 sm:p-10 md:p-16 flex flex-col justify-center rounded-sm shadow-sm ${bfClass("empresa-vision-box")}`} style={{ background: "#191D33" }}>
            <TextFormatStyle id="empresa-vision-titulo" format={fmt.visionTitulo} sizeCategory="heading-xl" />
            <h3 className="tf-empresa-vision-titulo font-heading text-lg sm:text-xl md:text-2xl font-extrabold uppercase text-white mb-2 sm:mb-3 md:mb-4">{e.visionTitulo || "Visión"}</h3>
            <TextFormatStyle id="empresa-vision-texto" format={fmt.visionTexto} sizeCategory="body-base" />
            <p className="tf-empresa-vision-texto font-body font-light text-light leading-normal sm:leading-relaxed text-sm sm:text-base">{e.vision}</p>
          </Reveal>
        </div>
      </section>

      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-16 md:pt-28 pb-10 sm:pb-16 md:pb-28">
        <Reveal className="mb-6 sm:mb-8 md:mb-12">
          <SectionTag id="empresa-valores" label={e.valoresTitulo || "Nuestros Valores"} labelFormat={fmt.valoresTitulo} />
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {e.valores.map((v, i) => {
            const vfmt = v.formats || {};
            return (
              <React.Fragment key={v.nombre}>
                <BoxFormatStyle id={`empresa-valor-${i}-box`} format={vfmt.box} />
                <Reveal delay={i * 80} className={`bg-white border border-black/10 p-7 text-center ${bfClass(`empresa-valor-${i}-box`)}`}>
                  <TextFormatStyle id={`empresa-valor-${i}-nombre`} format={vfmt.nombre} sizeCategory="heading-base" />
                  <h4 className={`tf-empresa-valor-${i}-nombre font-heading font-bold uppercase tracking-wide text-tertiary mb-2`}>{v.nombre}</h4>
                  <TextFormatStyle id={`empresa-valor-${i}-descripcion`} format={vfmt.descripcion} sizeCategory="body-sm" />
                  <p className={`tf-empresa-valor-${i}-descripcion font-body text-sm text-black/60 leading-relaxed`}>{v.descripcion}</p>
                </Reveal>
              </React.Fragment>
            );
          })}
        </div>
      </section>
    </>
  );
}
