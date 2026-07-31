"use client";
import { useState } from "react";

const DEVICES = [
  { key: "mobile", label: "Celular", width: 375 },
  { key: "tablet", label: "Tablet", width: 834 },
  { key: "desktop", label: "Escritorio", width: 1280 },
];

const PAGES = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/empresa", label: "Empresa" },
  { href: "/comercio-exterior", label: "Comercio Exterior" },
  { href: "/contacto", label: "Contacto" },
  { href: "/trabaja-con-nosotros", label: "Trabaja con Nosotros" },
];

export default function AdminPreviewPage() {
  const [device, setDevice] = useState("mobile");
  const [pageHref, setPageHref] = useState("/");
  const [reloadKey, setReloadKey] = useState(0);

  const current = DEVICES.find((d) => d.key === device);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary mb-2">Vista previa responsive</h1>
      <p className="font-body text-sm text-primary/60 mb-6">
        Mostrá cualquier página del sitio tal como se ve en celular, tablet o escritorio. Esta vista previa refleja los
        <strong> últimos cambios guardados</strong> — si acabás de editar algo, hacé clic en "Guardar" en la sección
        correspondiente y después en "Actualizar vista previa" acá abajo.
      </p>

      <div className="bg-white rounded-2xl border border-black/5 p-5 mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="font-body text-xs font-medium text-primary/70 mb-1 block">Página</label>
          <select
            value={pageHref}
            onChange={(e) => setPageHref(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2 font-body text-sm"
          >
            {PAGES.map((p) => (
              <option key={p.href} value={p.href}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-body text-xs font-medium text-primary/70 mb-1 block">Dispositivo</label>
          <div className="flex gap-1">
            {DEVICES.map((d) => (
              <button
                key={d.key}
                onClick={() => setDevice(d.key)}
                className={`px-3 py-2 rounded-lg text-xs font-body font-semibold transition-colors ${
                  device === d.key ? "bg-tertiary text-white" : "bg-black/5 text-primary/70 hover:bg-black/10"
                }`}
              >
                {d.label} ({d.width}px)
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setReloadKey((k) => k + 1)}
          className="self-end inline-flex items-center justify-center rounded-full border border-black/15 text-primary text-xs font-semibold px-4 py-2 hover:bg-black/5 transition-colors"
        >
          ↻ Actualizar vista previa
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-4">
        <div className="overflow-x-auto">
          <div
            className="mx-auto border border-black/10 rounded-md shadow-inner bg-white"
            style={{ width: current.width, minWidth: current.width }}
          >
            <iframe
              key={`${pageHref}-${device}-${reloadKey}`}
              src={pageHref}
              title="Vista previa"
              style={{ width: current.width, height: 800, border: "none", display: "block" }}
            />
          </div>
        </div>
        <p className="font-body text-[11px] text-primary/40 mt-3 text-center">
          {current.width}px de ancho — en escritorio podés desplazarte hacia los costados si no entra completo en la pantalla.
        </p>
      </div>
    </div>
  );
}
