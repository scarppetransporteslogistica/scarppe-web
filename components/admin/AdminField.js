export function AdminField({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-black/10 px-4 py-2.5 font-body text-primary text-sm focus:outline-none focus:ring-2 focus:ring-tertiary/40"
      />
    </div>
  );
}

export function AdminTextarea({ label, value, onChange, rows = 5 }) {
  return (
    <div>
      <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">{label}</label>
      <textarea
        value={value ?? ""}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-black/10 px-4 py-2.5 font-body text-primary text-sm focus:outline-none focus:ring-2 focus:ring-tertiary/40"
      />
    </div>
  );
}

export function AdminColor({ label, value, onChange }) {
  return (
    <div>
      <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">{label}</label>
      <div className="flex items-center gap-3">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-14 rounded border border-black/10" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-black/10 px-4 py-2.5 font-body text-primary text-sm focus:outline-none focus:ring-2 focus:ring-tertiary/40"
        />
      </div>
    </div>
  );
}
