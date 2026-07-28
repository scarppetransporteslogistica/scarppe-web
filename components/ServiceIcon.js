const PATHS = {
  "transporte-nacional": "M3 17h1a2 2 0 0 0 4 0h7a2 2 0 0 0 4 0h1M3 17V8a1 1 0 0 1 1-1h9v10M3 17v-4h13M16 7h3.5l3.5 4v6h-2M8 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm11 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  "transporte-internacional": "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z",
  "logistica-integral": "M21 8 12 3 3 8l9 5 9-5ZM3 8v8l9 5 9-5V8M12 13v8",
  "deposito-y-almacenaje": "M3 21V9l9-5 9 5v12H3ZM9 21v-7h6v7M3 9h18",
  "tramites-aduaneros": "M9 12h6M9 16h6M8 3h8l3 4v14H5V7l3-4Z",
  "carga-seca-en-general": "M21 8 12 3 3 8v8l9 5 9-5V8ZM3 8l9 5 9-5M12 13v8",
  "carga-por-metraje-cubico": "M4 7v10l8 4 8-4V7l-8-4-8 4Zm0 0 8 4 8-4M12 11v10",
  "contenedores-con-y-sin-carga": "M3 7h18v11H3V7Zm4 0v11m5-11v11m5-11v11",
};

export default function ServiceIcon({ slug, className = "" }) {
  const d = PATHS[slug] || PATHS["logistica-integral"];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  );
}
