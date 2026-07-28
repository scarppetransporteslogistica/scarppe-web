import { getContent } from "@/lib/db";
import SectionTag from "@/components/SectionTag";
import Reveal from "@/components/Reveal";
import CVForm from "@/components/CVForm";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { pages } = getContent();
  return { title: pages.trabajaConNosotros.seo.title, description: pages.trabajaConNosotros.seo.description };
}

export default function TrabajaConNosotrosPage() {
  const { pages } = getContent();
  const t = pages.trabajaConNosotros;

  return (
    <section style={{ background: "#F2F1F1" }} className="py-24">
      <div className="max-w-container mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-start">
        <Reveal>
          <SectionTag label="Trabaja con Nosotros" title={t.titulo} />
          <p className="font-body text-black/65 leading-relaxed text-lg">{t.texto}</p>
        </Reveal>
        <Reveal delay={100} className="bg-white border border-black/10 p-8">
          <CVForm />
        </Reveal>
      </div>
    </section>
  );
}
