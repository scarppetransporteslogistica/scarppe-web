import { getContent } from "@/lib/db";
import SectionTag from "@/components/SectionTag";
import Reveal from "@/components/Reveal";
import CVForm from "@/components/CVForm";
import TextFormatStyle from "@/components/TextFormatStyle";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { pages } = getContent();
  return { title: pages.trabajaConNosotros.seo.title, description: pages.trabajaConNosotros.seo.description };
}

export default function TrabajaConNosotrosPage() {
  const { pages } = getContent();
  const t = pages.trabajaConNosotros;
  const fmt = t.formats || {};

  return (
    <section style={{ background: "#F2F1F1" }} className="py-10 sm:py-14 md:py-24">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-16 items-start">
        <Reveal>
          <SectionTag id="tcn-hero" label={t.eyebrow || "Trabaja con Nosotros"} title={t.titulo} labelFormat={fmt.eyebrow} titleFormat={fmt.titulo} />
          <TextFormatStyle id="tcn-texto" format={fmt.texto} sizeCategory="body-lg" />
          <p className="tf-tcn-texto font-body text-black/65 leading-relaxed text-lg">{t.texto}</p>
        </Reveal>
        <Reveal delay={100} className="bg-white border border-black/10 p-8">
          <CVForm />
        </Reveal>
      </div>
    </section>
  );
}
