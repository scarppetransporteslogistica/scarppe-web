"use client";
import { useState } from "react";

const DEVICES = [
  ["desktop", "Escritorio"],
  ["tablet", "Tablet"],
  ["mobile", "Celular"],
];

function NumField({ label, value, onChange, step = 1, placeholder = "" }) {
  return (
    <div>
      <label className="font-body text-[10.5px] text-primary/55 block mb-1">{label}</label>
      <input
        type="number"
        step={step}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-full rounded border border-black/10 px-2 py-1.5 text-xs font-body text-center"
      />
    </div>
  );
}

// Reusable box/container formatting panel: width/height, padding & margin on
// all four sides, border-radius, internal text size and content alignment —
// for buttons, cards and boxes. Same opt-in + per-device pattern as
// TextFormatControls.
export default function BoxFormatControls({ label = "Tamaño del cuadro", value, onChange }) {
  const fmt = value || {};
  const [device, setDevice] = useState("desktop");
  const current = device === "desktop" ? fmt : fmt[device] || {};

  function patch(p) {
    if (device === "desktop") {
      onChange({ ...fmt, ...p });
    } else {
      onChange({ ...fmt, [device]: { ...(fmt[device] || {}), ...p } });
    }
  }

  function resetDevice() {
    if (device === "desktop") {
      onChange({ tablet: fmt.tablet, mobile: fmt.mobile });
    } else {
      const next = { ...fmt };
      delete next[device];
      onChange(next);
    }
  }

  function copyFromDesktop() {
    const { tablet, mobile, ...desktopOnly } = fmt;
    onChange({ ...fmt, [device]: { ...desktopOnly } });
  }

  const hasAnything = Object.keys(fmt).some((k) => k !== "tablet" && k !== "mobile" && fmt[k] !== "" && fmt[k] !== undefined) ||
    (fmt.tablet && Object.keys(fmt.tablet).length) || (fmt.mobile && Object.keys(fmt.mobile).length);

  return (
    <div className="border border-black/10 rounded-lg p-3 bg-black/[0.015]">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="font-body text-[11px] font-semibold text-primary/60 uppercase tracking-wide">
          {label}
          {!hasAnything && <span className="font-normal normal-case text-primary/35"> · sin cambios</span>}
        </p>
        <div className="flex gap-1">
          {DEVICES.map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setDevice(k)}
              className={`px-2 py-1 rounded text-[11px] font-body transition-colors ${
                device === k ? "bg-tertiary text-white" : "bg-white text-primary/60 border border-black/10 hover:border-tertiary/40"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {device !== "desktop" && (
        <div className="flex items-center justify-between gap-2 mb-2 -mt-1">
          <p className="font-body text-[10.5px] text-primary/45">
            Solo aplica en {device === "tablet" ? "tablet" : "celular"}. Vacío = usa Escritorio.
          </p>
          <button type="button" onClick={copyFromDesktop} className="shrink-0 text-[10.5px] font-body text-tertiary hover:underline">
            Copiar de Escritorio
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
        <NumField label="Ancho (%)" value={current.width} onChange={(v) => patch({ width: v })} placeholder="auto" />
        <NumField label="Ancho máx. (%)" value={current.maxWidth} onChange={(v) => patch({ maxWidth: v })} placeholder="100" />
        <NumField label="Alto (px)" value={current.height} onChange={(v) => patch({ height: v })} placeholder="auto" />
        <NumField label="Alto máx. (px)" value={current.maxHeight} onChange={(v) => patch({ maxHeight: v })} placeholder="ninguno" />
      </div>

      <p className="font-body text-[10.5px] text-primary/45 mb-1">Padding interno (px)</p>
      <div className="grid grid-cols-4 gap-2 mb-2">
        <NumField label="Arriba" value={current.paddingTop} onChange={(v) => patch({ paddingTop: v })} />
        <NumField label="Abajo" value={current.paddingBottom} onChange={(v) => patch({ paddingBottom: v })} />
        <NumField label="Izq." value={current.paddingLeft} onChange={(v) => patch({ paddingLeft: v })} />
        <NumField label="Der." value={current.paddingRight} onChange={(v) => patch({ paddingRight: v })} />
      </div>

      <p className="font-body text-[10.5px] text-primary/45 mb-1">Margen externo (px)</p>
      <div className="grid grid-cols-4 gap-2 mb-2">
        <NumField label="Arriba" value={current.marginTop} onChange={(v) => patch({ marginTop: v })} />
        <NumField label="Abajo" value={current.marginBottom} onChange={(v) => patch({ marginBottom: v })} />
        <NumField label="Izq." value={current.marginLeft} onChange={(v) => patch({ marginLeft: v })} />
        <NumField label="Der." value={current.marginRight} onChange={(v) => patch({ marginRight: v })} />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-1">
        <NumField label="Radio de borde (px)" value={current.borderRadius} onChange={(v) => patch({ borderRadius: v })} />
        <NumField label="Tamaño texto interno (%)" value={current.fontSizePercent} onChange={(v) => patch({ fontSizePercent: v })} step={5} placeholder="100" />
        <div>
          <label className="font-body text-[10.5px] text-primary/55 block mb-1">Alineación del contenido</label>
          <select
            value={current.align ?? ""}
            onChange={(e) => patch({ align: e.target.value })}
            className="w-full rounded border border-black/10 px-1 py-1.5 text-xs font-body"
          >
            <option value="">Como está</option>
            <option value="left">Izquierda</option>
            <option value="center">Centro</option>
            <option value="right">Derecha</option>
          </select>
        </div>
      </div>

      <button type="button" onClick={resetDevice} className="mt-1 text-[10.5px] font-body text-red-500/80 hover:underline">
        Restablecer {device === "desktop" ? "todo" : device === "tablet" ? "tablet" : "celular"}
      </button>
    </div>
  );
}
