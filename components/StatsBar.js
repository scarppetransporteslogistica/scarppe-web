import Reveal from "./Reveal";

export default function StatsBar({ stats }) {
  return (
    <section className="bg-primary">
      <div className="max-w-container mx-auto grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 80}
            className={`text-center py-12 px-6 hover:bg-secondary transition-colors ${
              i < stats.length - 1 ? "border-r border-white/10" : ""
            }`}
          >
            <p className="font-heading text-5xl md:text-6xl font-extrabold text-accent leading-none">{s.value}</p>
            <p className="font-body text-xs uppercase tracking-wide text-light mt-3">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
