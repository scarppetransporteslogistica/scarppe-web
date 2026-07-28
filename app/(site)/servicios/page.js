import { getContent } from "@/lib/db";
import ServiceCard from "@/components/ServiceCard";
import SectionTag from "@/components/SectionTag";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { pages } = getContent();
  return { title: pages.servicios.seo.title, description: pages.servicios.seo.description };
}

export default function ServiciosPage() {
  const { pages, servicios } = getContent();

  return (
    <>
      <section style={{ background: "#191D33" }} className="py-20">
        <div className="max-w-container mx-auto px-6 lg:px-10">
          <Reveal>
            <SectionTag label="Servicios" light title={pages.servicios.titulo} />
          </Reveal>
        </div>
      </section>
      <section className="max-w-container mx-auto px-6 lg:px-10 py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 border border-black/10">
          {servicios.map((s, i) => (
            <Reveal key={s.slug} delay={i * 60}>
              <ServiceCard servicio={s} index={i} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
