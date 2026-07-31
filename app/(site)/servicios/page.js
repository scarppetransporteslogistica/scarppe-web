import { getContent } from "@/lib/db";
import ServiceCard from "@/components/ServiceCard";
import SectionTag from "@/components/SectionTag";
import Reveal from "@/components/Reveal";
import TextFormatStyle from "@/components/TextFormatStyle";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { pages } = getContent();
  return { title: pages.servicios.seo.title, description: pages.servicios.seo.description };
}

function ServiceGroup({ title, titleId, titleFormat, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-16 last:mb-0 border border-black/10 border-t-4 border-t-tertiary rounded-sm p-6 md:p-10">
      <Reveal className="mb-10">
        <TextFormatStyle id={titleId} format={titleFormat} />
        <h2 className={`tf-${titleId} font-heading text-2xl md:text-3xl font-extrabold uppercase text-primary tracking-tight`}>{title}</h2>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((s, i) => (
          <Reveal key={s.slug} delay={i * 60} className="h-full">
            <ServiceCard servicio={s} index={i} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function ServiciosPage() {
  const { pages, servicios } = getContent();
  const transporte = servicios.filter((s) => (s.categoria || "transporte") === "transporte");
  const logistica = servicios.filter((s) => s.categoria === "logistica");
  const fmt = pages.servicios.formats || {};

  return (
    <>
      <section style={{ background: "#191D33" }} className="py-20">
        <div className="max-w-container mx-auto px-6 lg:px-10">
          <Reveal>
            <SectionTag
              id="servicios-hero"
              label={pages.servicios.eyebrow || "Servicios"}
              light
              title={pages.servicios.titulo}
              labelFormat={fmt.eyebrow}
              titleFormat={fmt.titulo}
            />
          </Reveal>
        </div>
      </section>
      <section className="max-w-container mx-auto px-6 lg:px-10 py-24">
        <ServiceGroup
          title={pages.servicios.categoriaTransporteTitulo || "Soluciones de Transporte"}
          titleId="servicios-grupo-transporte-titulo"
          titleFormat={fmt.categoriaTransporteTitulo}
          items={transporte}
        />
        <ServiceGroup
          title={pages.servicios.categoriaLogisticaTitulo || "Soluciones Logísticas"}
          titleId="servicios-grupo-logistica-titulo"
          titleFormat={fmt.categoriaLogisticaTitulo}
          items={logistica}
        />
      </section>
    </>
  );
}
