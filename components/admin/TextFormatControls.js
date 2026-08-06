"use client";
import { useState } from "react";
import { ALIGN_OPTIONS, WEIGHT_OPTIONS, hasOverride, percentToPt } from "@/lib/textFormat";

// Primary device buttons; tablet/mobile additionally have a portrait/landscape
// orientation toggle, since tablet horizontal needs its own composition and
// must never silently reuse the desktop or tablet-vertical one.
const PRIMARY_DEVICES = [
  ["desktop", "Escritorio"],
  ["tablet", "Tablet"],
  ["mobile", "Celular"],
  ["wide", "Pantalla grande"],
];

function effectiveKey(primary, orientation) {
  if (primary === "tablet") return orientation === "landscape" ? "tabletLandscape" : "tabletPortrait";
  if (primary === "mobile") return orientation === "landscape" ? "mobileLandscape" : "mobilePortrait";
  return primary; // "desktop" | "wide"
}

function primaryHasOverride(fmt, primary) {
  if (primary === "desktop") return hasOverride(fmt, "desktop");
  if (primary === "wide") return hasOverride(fmt, "wide");
  if (primary === "tablet") return hasOverride(fmt, "tabletPortrait") || hasOverride(fmt, "tabletLandscape");
  if (primary === "mobile") return hasOverride(fmt, "mobilePortrait") || hasOverride(fmt, "mobileLandscape");
  return false;
}

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
export default function TextFormatControls({ label = "Formato del texto", value, onChange, showFirstLine = true, previewText, sizeCategory }) {
  const fmt = value || {};
  const [primary, setPrimary] = useState("desktop");
  const [orientation, setOrientation] = useState("portrait");
  const device = effectiveKey(primary, orientation);
  const current = device === "desktop" ? fmt : fmt[device] || (device === "tabletPortrait" && fmt.tablet) || (device === "mobilePortrait" && fmt.mobile) || {};

  function patch(p) {
    if (device === "desktop") {
      onChange({ ...fmt, ...p });
    } else {
      onChange({ ...fmt, [device]: { ...(fmt[device] || {}), ...p } });
    }
  }

  function resetDevice() {
    if (device === "desktop") {
      const { tabletPortrait, tabletLandscape, mobilePortrait, mobileLandscape, wide, tablet, mobile, ...rest } = fmt;
      onChange({ tabletPortrait, tabletLandscape, mobilePortrait, mobileLandscape, wide, tablet, mobile });
    } else {
      const next = { ...fmt };
      delete next[device];
      if (device === "tabletPortrait") delete next.tablet;
      if (device === "mobilePortrait") delete next.mobile;
      onChange(next);
    }
  }

  function copyFromDesktop() {
    const { tabletPortrait, tabletLandscape, mobilePortrait, mobileLandscape, wide, tablet, mobile, ...desktopOnly } = fmt;
    onChange({ ...fmt, [device]: { ...desktopOnly } });
  }

  const hasAnything = PRIMARY_DEVICES.some(([k]) => primaryHasOverride(fmt, k));

  return (
    <div className="border border-black/10 rounded-lg p-3 bg-black/[0.015]">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div>
          <p className="font-body text-[11px] font-semibold text-primary/60 uppercase tracking-wide">
            {label}
            {!hasAnything && <span className="font-normal normal-case text-primary/35"> · sin cambios</span>}
          </p>
          {previewText ? (
            <p className="font-body text-[11px] text-primary/40 normal-case mt-0.5 truncate max-w-[280px]">
              Texto: “{String(previewText).slice(0, 60)}{String(previewText).length > 60 ? "…" : ""}”
            </p>
          ) : null}
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

      <div className="grid grid-cols-2 gap-2 mb-2">
        <NumField
          label="Tamaño (pt)"
          value={current.fontSizePt ?? (current.fontSizePercent ? percentToPt(current.fontSizePercent, sizeCategory) : "")}
          onChange={(v) => patch({ fontSizePt: v, fontSizePercent: undefined })}
          step={0.5}
          placeholder="12"
        />
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

      <div className="grid grid-cols-2 gap-2 mb-2">
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

      <div className="grid grid-cols-2 gap-2 mb-2">
        <NumField label="Ancho máx. (%)" value={current.maxWidth} onChange={(v) => patch({ maxWidth: v })} step={1} placeholder="100" />
        <NumField label="Margen sup. (px)" value={current.marginTop} onChange={(v) => patch({ marginTop: v })} />
        <NumField label="Margen inf. (px)" value={current.marginBottom} onChange={(v) => patch({ marginBottom: v })} />
        <NumField label="Orden (order)" value={current.order} onChange={(v) => patch({ order: v })} placeholder="auto" />
      </div>

      <label className="flex items-center gap-2 mb-2 cursor-pointer">
        <input type="checkbox" checked={!!current.hidden} onChange={(e) => patch({ hidden: e.target.checked })} className="rounded border-black/20" />
        <span className="font-body text-[11px] text-primary/70">
          Ocultar {device === "desktop" ? "" : `en ${PRIMARY_DEVICES.find(([k]) => k === primary)[1].toLowerCase()}${primary !== "wide" ? (orientation === "landscape" ? " horizontal" : " vertical") : ""}`}
        </span>
      </label>

      <button type="button" onClick={resetDevice} className="mt-1 text-[10.5px] font-body text-red-500/80 hover:underline">
        Restablecer {device === "desktop" ? "todo" : PRIMARY_DEVICES.find(([k]) => k === primary)[1].toLowerCase()}
      </button>
    </div>
  );
}
