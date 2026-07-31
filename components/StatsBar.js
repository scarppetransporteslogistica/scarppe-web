import Reveal from "./Reveal";

export default function StatsBar({ stats, valueScale }) {
  const scale = (Number(valueScale) || 100) / 100;
  return (
    <section className="bg-primary" style={{ "--stats-value-scale": scale }}>
      <div className="max-w-container mx-auto grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 80}
            className={`text-center py-6 sm:py-8 md:py-12 px-4 sm:px-6 hover:bg-secondary transition-colors ${
              i < stats.length - 1 ? "border-r border-white/10" : ""
            }`}
          >
            <p className="stats-value font-heading font-extrabold text-accent leading-none">{s.value}</p>
            <p className="font-body text-xs uppercase tracking-wide text-light mt-3">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
