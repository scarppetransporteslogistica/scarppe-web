"use client";
import { useState } from "react";
import { ALIGN_OPTIONS } from "@/lib/textFormat";

const DEVICES = [
  ["desktop", "Escritorio"],
  ["tablet", "Tablet"],
  ["mobile", "Celular"],
];

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

  const hasAnything =
    fmt.align || fmt.indentLeft || fmt.indentRight || fmt.firstLine ||
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
        <p className="font-body text-[10.5px] text-primary/45 mb-2 -mt-1">
          Solo aplica en {device === "tablet" ? "tablet" : "celular"}. Lo que dejes vacío usa la configuración de Escritorio.
        </p>
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

      <div className={`grid gap-2 ${showFirstLine ? "grid-cols-3" : "grid-cols-2"}`}>
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
        <div>
          <label className="font-body text-[10.5px] text-primary/55 block mb-1">Sangría der. (px)</label>
          <input
            type="number"
            min="0"
            value={current.indentRight ?? ""}
            onChange={(e) => patch({ indentRight: e.target.value === "" ? "" : Number(e.target.value) })}
            className="w-full rounded border border-black/10 px-2 py-1.5 text-xs font-body text-center"
          />
        </div>
        {showFirstLine && (
          <div>
            <label className="font-body text-[10.5px] text-primary/55 block mb-1">1ª línea (px)</label>
            <input
              type="number"
              value={current.firstLine ?? ""}
              onChange={(e) => patch({ firstLine: e.target.value === "" ? "" : Number(e.target.value) })}
              className="w-full rounded border border-black/10 px-2 py-1.5 text-xs font-body text-center"
            />
          </div>
        )}
      </div>

      <button type="button" onClick={resetDevice} className="mt-2 text-[10.5px] font-body text-red-500/80 hover:underline">
        Restablecer {device === "desktop" ? "todo" : device === "tablet" ? "tablet" : "celular"}
      </button>
    </div>
  );
}
