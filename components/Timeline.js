import Reveal from "./Reveal";

export default function Timeline({ items }) {
  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-tertiary/25" />
      <div className="space-y-10">
        {items.map((item, i) => (
          <Reveal key={i} delay={i * 100}>
            <div className="relative pl-10">
              <span className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-accent ring-4 ring-[#F2F1F1]" />
              <p className="font-heading text-accent font-bold text-sm uppercase tracking-[0.2em] mb-1.5">{item.anio}</p>
              <p className="font-body text-primary/80 leading-relaxed">{item.hito}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
