export default function SectionTag({ label, title, light = false }) {
  return (
    <div className="mb-6">
      <p className={`font-heading text-xs font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-3 ${light ? "text-accent" : "text-tertiary"}`}>
        <span className="w-6 h-0.5 bg-current inline-block" />
        {label}
      </p>
      {title && (
        <h2 className={`font-heading text-4xl md:text-5xl font-extrabold uppercase leading-[0.95] tracking-tight ${light ? "text-white" : "text-primary"}`}>
          {title}
        </h2>
      )}
    </div>
  );
}
