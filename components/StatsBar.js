import Reveal from "./Reveal";
import TextFormatStyle from "./TextFormatStyle";
import BoxFormatStyle, { bfClass } from "./BoxFormatStyle";

export default function StatsBar({ stats, valueScale }) {
  const scale = (Number(valueScale) || 100) / 100;
  return (
    <section className="bg-primary" style={{ "--stats-value-scale": scale }}>
      <div className="max-w-container mx-auto grid grid-cols-2 desktop:grid-cols-4">
        {stats.map((s, i) => {
          const fmt = s.formats || {};
          return (
            <div key={s.label} className="relative">
              <BoxFormatStyle id={`inicio-stat-${i}-box`} format={fmt.box} />
              <Reveal
                delay={i * 80}
                className={`${bfClass(`inicio-stat-${i}-box`)} text-center py-6 sm:py-8 md:py-12 px-4 sm:px-6 hover:bg-secondary transition-colors ${
                  i < stats.length - 1 ? "border-r border-white/10" : ""
                }`}
              >
                <TextFormatStyle id={`inicio-stat-${i}-valor`} format={fmt.valor} sizeCategory="stats-value" />
                <p className={`tf-inicio-stat-${i}-valor stats-value font-heading font-extrabold text-accent leading-none`}>{s.value}</p>
                <TextFormatStyle id={`inicio-stat-${i}-label`} format={fmt.label} sizeCategory="label-xxs" />
                <p className={`tf-inicio-stat-${i}-label font-body text-xs uppercase tracking-wide text-light mt-3`}>{s.label}</p>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
