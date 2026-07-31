const ICONS = [
  "M3 17h1a2 2 0 0 0 4 0h7a2 2 0 0 0 4 0h1M3 17V8a1 1 0 0 1 1-1h9v10M16 7h3.5l3.5 4v6h-2",
  "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z",
  "M3 21V9l9-5 9 5v12H3ZM9 21v-7h6v7",
  "M21 8 12 3 3 8l9 5 9-5ZM3 8v8l9 5 9-5V8",
];

export default function TrustStrip({ items }) {
  return (
    <div className="bg-accent">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-2 sm:gap-y-3">
        {items.map((text, i) => (
          <span key={text} className="flex items-center gap-3 font-heading text-sm font-bold uppercase tracking-wide text-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
              <path d={ICONS[i % ICONS.length]} />
            </svg>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
