"use client";
import { useState } from "react";
import { ALIGN_OPTIONS, hasOverride } from "@/lib/textFormat";
import { GOOGLE_FONT_OPTIONS } from "@/lib/theme";
import { weightsForFont } from "@/lib/fonts";

const PRIMARY_DEVICES = [
  ["desktop", "Escritorio"],
  ["tablet", "Tablet"],
  ["mobile", "Celular"],
  ["wide", "Pantalla grande"],
];

function effectiveKey(primary, orientation) {
  if (primary === "tablet") return orientation === "landscape" ? "tabletLandscape" : "tabletPortrait";
  if (primary === "mobile") return orientation === "landscape" ? "mobileLandscape" : "mobilePortrait";
  return primary;
}

function primaryHasOverride(fmt, primary) {
  if (primary === "desktop") return hasOverride(fmt, "desktop");
  if (primary === "wide") return hasOverride(fmt, "wide");
  if (primary === "tablet") return hasOverride(fmt, "tabletPortrait") || hasOverride(fmt, "tabletLandscape");
  if (primary === "mobile") return hasOverride(fmt, "mobilePortrait") || hasOverride(fmt, "mobileLandscape");
  return false;
}

const WEIGHT_LABELS = {
  "100": "Thin",
  "200": "Extra Light",
  "300": "Light",
  "400": "Regular",
  "500": "Medium",
  "600": "Semi Bold",
  "700": "Bold",
  "800": "Extra Bold",
  "900": "Black",
};

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

// Section-wide typography default: independent from the per-block "Formato"
// controls next to each individual title/párrafo — this sets a fallback
// look (font family, weight, size in pt, line-height, letter-spacing,
// color, alignment) for every text inside this whole admin section, per
// device/orientation. Opt-in: leave everything blank and nothing changes.
export default function SectionTypographyControls({ label = "Tipografía de la sección", value, onChange }) {
  const fmt = value || {};
  const [primary, setPrimary] = useState("desktop");
  const [orientation, setOrientation] = useState("portrait");
  const device = effectiveKey(primary, orientation);
  const current = device === "desktop" ? fmt : fmt[device] || {};
  const weightOptions = weightsForFont(current.fontFamily);

  function patch(p) {
    if (device === "desktop") {
      onChange({ ...fmt, ...p });
    } else {
      onChange({ ...fmt, [device]: { ...(fmt[device] || {}), ...p } });
    }
  }

  function resetDevice() {
    if (device === "desktop") {
      const { tabletPortrait, tabletLandscape, mobilePortrait, mobileLandscape, wide, ...rest } = fmt;
      onChange({ tabletPortrait, tabletLandscape, mobilePortrait, mobileLandscape, wide });
    } else {
      const next = { ...fmt };
      delete next[device];
      onChange(next);
    }
  }

  function copyFromDesktop() {
    const { tabletPortrait, tabletLandscape, mobilePortrait, mobileLandscape, wide, ...desktopOnly } = fmt;
    onChange({ ...fmt, [device]: { ...desktopOnly } });
  }

  const hasAnything = PRIMARY_DEVICES.some(([k]) => primaryHasOverride(fmt, k));

  return (
    <div className="border border-black/10 rounded-lg p-4 bg-tertiary/[0.03]">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div>
          <p className="font-body text-[11px] font-semibold text-primary/60 uppercase tracking-wide">
            {label}
            {!hasAnything && <span className="font-normal normal-case text-primary/35"> · sin cambios (se usa la tipografía general del sitio)</span>}
          </p>
          <p className="font-body text-[11px] text-primary/40 normal-case mt-0.5">
            Define una tipografía por defecto para todos los textos de esta sección. No afecta a las demás secciones ni a los controles de "Formato" de cada texto individual, que siguen mandando si están configurados.
          </p>
        </div>
        <div className="flex gap-1 flex-wrap">
          {PRIMARY_DEVICES.map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setPrimary(k)}
              className={`relative px-2 py-1 rounded text-[11px] font-body transition-colors ${
                primary === k ? "bg-tertiary text-white" : "bg-white text-primary/60 border border-black/10 hover:border-tertiary/40"
              }`}
            >
              {l}
              {primaryHasOverride(fmt, k) && (
                <span className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${primary === k ? "bg-white" : "bg-tertiary"}`} title="Personalizado" />
              )}
            </button>
          ))}
        </div>
      </div>

      {(primary === "tablet" || primary === "mobile") && (
        <div className="flex gap-1 mb-2">
          {[["portrait", "Vertical"], ["landscape", "Horizontal"]].map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setOrientation(k)}
              className={`px-2.5 py-1 rounded text-[10.5px] font-body border transition-colors ${
                orientation === k ? "bg-primary text-white border-primary" : "bg-white text-primary/60 border-black/10 hover:border-primary/30"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      {device !== "desktop" && (
        <div className="flex items-center justify-between gap-2 mb-2 -mt-1">
          <p className="font-body text-[10.5px] text-primary/45">
            {hasOverride(fmt, device) ? "Personalizado" : "Hereda de Escritorio"} — solo aplica en {PRIMARY_DEVICES.find(([k]) => k === primary)[1].toLowerCase()}
            {primary !== "wide" ? ` ${orientation === "landscape" ? "horizontal" : "vertical"}` : ""}.
          </p>
          <button type="button" onClick={copyFromDesktop} className="shrink-0 text-[10.5px] font-body text-tertiary hover:underline">
            Copiar de Escritorio
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-2 mb-2">
        <div>
          <label className="font-body text-[10.5px] text-primary/55 block mb-1">Familia tipográfica</label>
          <select
            value={current.fontFamily ?? ""}
            onChange={(e) => patch({ fontFamily: e.target.value || undefined, weight: "" })}
            className="w-full rounded border border-black/10 px-2 py-1.5 text-xs font-body"
          >
            <option value="">Como está (tipografía general del sitio)</option>
            {GOOGLE_FONT_OPTIONS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-body text-[10.5px] text-primary/55 block mb-1">Peso</label>
          <select
            value={current.weight ?? ""}
            onChange={(e) => patch({ weight: e.target.value })}
            className="w-full rounded border border-black/10 px-2 py-1.5 text-xs font-body"
          >
            <option value="">Como está</option>
            {weightOptions.map((w) => (
              <option key={w} value={w}>{WEIGHT_LABELS[w] || w}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <NumField label="Tamaño (pt)" value={current.sizePt} onChange={(v) => patch({ sizePt: v })} step={0.5} placeholder="Como está" />
        <NumField label="Interlineado (%)" value={current.lineHeightPercent} onChange={(v) => patch({ lineHeightPercent: v })} step={5} placeholder="100" />
        <NumField label="Espaciado letras (px)" value={current.letterSpacing} onChange={(v) => patch({ letterSpacing: v })} step={0.5} placeholder="0" />
        <div>
          <label className="font-body text-[10.5px] text-primary/55 block mb-1">Color</label>
          <input
            type="text"
            value={current.color ?? ""}
            onChange={(e) => patch({ color: e.target.value })}
            placeholder="#193F73"
            className="w-full rounded border border-black/10 px-2 py-1.5 text-xs font-body"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 mb-2">
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

      <button type="button" onClick={resetDevice} className="mt-1 text-[10.5px] font-body text-red-500/80 hover:underline">
        Restablecer {device === "desktop" ? "todo" : PRIMARY_DEVICES.find(([k]) => k === primary)[1].toLowerCase()}
      </button>
    </div>
  );
}
