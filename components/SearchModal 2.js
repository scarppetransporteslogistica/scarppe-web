"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

export default function SearchModal({ open, onClose, servicios }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return (servicios || []).filter(
      (s) =>
        s.nombre.toLowerCase().includes(q) ||
        s.resumen.toLowerCase().includes(q) ||
        s.texto.toLowerCase().includes(q)
    );
  }, [query, servicios]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-start justify-center p-6 pt-24">
      <div className="bg-white border border-black/10 w-full max-w-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 border-b border-black/5 px-5 py-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/50">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar servicios..."
            className="flex-1 outline-none font-body text-primary placeholder:text-primary/40"
          />
          <button onClick={onClose} className="text-primary/50 hover:text-primary" aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {query && results.length === 0 && (
            <p className="px-5 py-6 text-primary/50 text-sm font-body">No se encontraron resultados para "{query}".</p>
          )}
          {results.map((s) => (
            <Link
              key={s.slug}
              href={`/servicios/${s.slug}`}
              onClick={onClose}
              className="block px-5 py-4 hover:bg-black/5 border-b border-black/5 last:border-0"
            >
              <p className="font-heading font-semibold text-primary">{s.nombre}</p>
              <p className="font-body text-sm text-primary/60 mt-1 line-clamp-1">{s.resumen}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
