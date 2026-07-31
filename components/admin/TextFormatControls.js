"use client";
import { useState } from "react";
import { ALIGN_OPTIONS, WEIGHT_OPTIONS } from "@/lib/textFormat";

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

// Reusable formatting panel used next to every title/subtítulo/párrafo/CTA in
// the admin. `value` is a format object (see lib/textFormat.js), `onChange`
// receives the updated object. Nothing set = no visual change on the site.
export default function TextFormatControls({ label = "Formato del texto", value, onChange, showFirstLine = true }) {
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

  const hasAnything =
    fmt.align || fmt.indentLeft || fmt.indentRight || fmt.firstLine || fmt.fontSizePercent || fmt.weight ||
    fmt.lineHeightPercent || fmt.letterSpacing || fmt.maxWidth || fmt.marginTop || fmt.marginBottom ||
    (fmt.tablet && Object.keys(fmt.tablet).length) ||
    (fmt.mobile && Object.keys(fmt.mobile).length);

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
            Solo aplica en {device === "tablet" ? "tablet" : "celular"}. Lo que dejes vacío usa la configuración de Escritorio.
          </p>
          <button type="button" onClick={copyFromDesktop} className="shrink-0 text-[10.5px] font-body text-tertiary hover:underline">
            Copiar de Escritorio
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1 mb-3">
        {ALIGN_OPTIONS.map((opt) => (
          <button
            key={opt.value || "default"}
            type="button"
            onClick={() => patch({ align: opt.value })}
            className={`px-2.5 py-1.5 rounded text-[11px] font-body border transition-colors ${
              (current.align || "") === opt.value
                ? "bg-primary text-white border-primary"
                : "bg-white text-primary/70 border-black/10 hover:border-primary/30"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
        <NumField label="Tamaño (%)" value={current.fontSizePercent} onChange={(v) => patch({ fontSizePercent: v })} step={5} placeholder="100" />
        <div>
          <label className="font-body text-[10.5px] text-primary/55 block mb-1">Peso</label>
          <select
            value={current.weight ?? ""}
            onChange={(e) => patch({ weight: e.target.value })}
            className="w-full rounded border border-black/10 px-1 py-1.5 text-xs font-body"
          >
            {WEIGHT_OPTIONS.map((w) => (
              <option key={w.value || "default"} value={w.value}>{w.label}</option>
            ))}
          </select>
        </div>
        <NumField label="Interlineado (%)" value={current.lineHeightPercent} onChange={(v) => patch({ lineHeightPercent: v })} step={5} placeholder="100" />
        <NumField label="Espaciado letras (px)" value={current.letterSpacing} onChange={(v) => patch({ letterSpacing: v })} step={0.5} placeholder="0" />
      </div>

      <div className={`grid gap-2 mb-2 ${showFirstLine ? "grid-cols-3" : "grid-cols-2"}`}>
        <div>
          <label className="font-body text-[10.5px] text-primary/55 block mb-1">Sangría izq. (px)</label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => patch({ indentLeft: Math.max(0, (Number(current.indentLeft) || 0) - 8) })}
              className="h-7 w-7 shrink-0 rounded border border-black/10 text-primary/60 hover:bg-black/5"
            >
              −
            </button>
            <input
              type="number"
              min="0"
              value={current.indentLeft ?? ""}
              onChange={(e) => patch({ indentLeft: e.target.value === "" ? "" : Number(e.target.value) })}
              className="w-full min-w-0 rounded border border-black/10 px-1.5 py-1 text-xs font-body text-center"
            />
            <button
              type="button"
              onClick={() => patch({ indentLeft: (Number(current.indentLeft) || 0) + 8 })}
              className="h-7 w-7 shrink-0 rounded border border-black/10 text-primary/60 hover:bg-black/5"
            >
              +
            </button>
          </div>
        </div>
        <NumField label="Sangría der. (px)" value={current.indentRight} onChange={(v) => patch({ indentRight: v })} />
        {showFirstLine && <NumField label="1ª línea (px)" value={current.firstLine} onChange={(v) => patch({ firstLine: v })} />}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <NumField label="Ancho máx. (%)" value={current.maxWidth} onChange={(v) => patch({ maxWidth: v })} step={1} placeholder="100" />
        <NumField label="Margen sup. (px)" value={current.marginTop} onChange={(v) => patch({ marginTop: v })} />
        <NumField label="Margen inf. (px)" value={current.marginBottom} onChange={(v) => patch({ marginBottom: v })} />
      </div>

      <button type="button" onClick={resetDevice} className="mt-2 text-[10.5px] font-body text-red-500/80 hover:underline">
        Restablecer {device === "desktop" ? "todo" : device === "tablet" ? "tablet" : "celular"}
      </button>
    </div>
  );
}
