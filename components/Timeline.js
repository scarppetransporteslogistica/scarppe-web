import Reveal from "./Reveal";

export default function Timeline({ items }) {
  return (
    <div className="relative">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-tertiary/20 md:-translate-x-1/2" />
      <div className="space-y-12">
        {items.map((item, i) => {
          const reversed = i % 2 === 1;
          return (
            <Reveal key={i} delay={i * 100}>
              <div
                className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-16 pl-12 md:pl-0 ${
                  reversed ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 overflow-hidden border border-black/10">
                  <img src={item.imagen} alt={item.hito} className="w-full h-52 md:h-56 object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-heading text-accent font-bold text-sm uppercase tracking-[0.2em]">{item.anio}</p>
                  <p className="font-body text-primary/80 mt-2 leading-relaxed">{item.hito}</p>
                </div>
                <span className="absolute left-4 md:left-1/2 top-1 w-3 h-3 rounded-full bg-accent -translate-x-1/2 ring-4 ring-white" />
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
