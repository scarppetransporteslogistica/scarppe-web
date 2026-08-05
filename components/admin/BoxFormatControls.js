"use client";
import { useState } from "react";
import { hasOverride } from "@/lib/textFormat";

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

function TextField({ label, value, onChange, placeholder = "" }) {
  return (
    <div>
      <label className="font-body text-[10.5px] text-primary/55 block mb-1">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-black/10 px-2 py-1.5 text-xs font-body"
      />
    </div>
  );
}

// Reusable box/container formatting panel: width/height, padding & margin on
// all four sides, border-radius, background, border, visibility, order,
// internal text size and content alignment — for buttons, cards and boxes.
// Same opt-in + per-device/orientation pattern as TextFormatControls.
export default function BoxFormatControls({ label = "Tamaño del cuadro", value, onChange }) {
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
        <p className="font-body text-[11px] font-semibold text-primary/60 uppercase tracking-wide">
          {label}
          {!hasAnything && <span className="font-normal normal-case text-primary/35"> · sin cambios</span>}
        </p>
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

      <div className="grid grid-cols-2 gap-2 mb-2">
        <NumField label="Ancho (%)" value={current.width} onChange={(v) => patch({ width: v })} placeholder="auto" />
        <NumField label="Ancho máx. (%)" value={current.maxWidth} onChange={(v) => patch({ maxWidth: v })} placeholder="100" />
        <NumField label="Alto (px)" value={current.height} onChange={(v) => patch({ height: v })} placeholder="auto" />
        <NumField label="Alto máx. (px)" value={current.maxHeight} onChange={(v) => patch({ maxHeight: v })} placeholder="ninguno" />
      </div>

      <p className="font-body text-[10.5px] text-primary/45 mb-1">Padding interno (px)</p>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <NumField label="Arriba" value={current.paddingTop} onChange={(v) => patch({ paddingTop: v })} />
        <NumField label="Abajo" value={current.paddingBottom} onChange={(v) => patch({ paddingBottom: v })} />
        <NumField label="Izq." value={current.paddingLeft} onChange={(v) => patch({ paddingLeft: v })} />
        <NumField label="Der." value={current.paddingRight} onChange={(v) => patch({ paddingRight: v })} />
      </div>

      <p className="font-body text-[10.5px] text-primary/45 mb-1">Margen externo (px)</p>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <NumField label="Arriba" value={current.marginTop} onChange={(v) => patch({ marginTop: v })} />
        <NumField label="Abajo" value={current.marginBottom} onChange={(v) => patch({ marginBottom: v })} />
        <NumField label="Izq." value={current.marginLeft} onChange={(v) => patch({ marginLeft: v })} />
        <NumField label="Der." value={current.marginRight} onChange={(v) => patch({ marginRight: v })} />
      </div>

      <p className="font-body text-[10.5px] text-primary/45 mb-1">Fondo y borde</p>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <TextField label="Color de fondo" value={current.background} onChange={(v) => patch({ background: v })} placeholder="#0D1024 o red" />
        <NumField label="Radio de borde (px)" value={current.borderRadius} onChange={(v) => patch({ borderRadius: v })} />
        <NumField label="Grosor de borde (px)" value={current.borderWidth} onChange={(v) => patch({ borderWidth: v })} placeholder="0" />
        <TextField label="Color de borde" value={current.borderColor} onChange={(v) => patch({ borderColor: v })} placeholder="#000000" />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
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
        <NumField label="Orden (order)" value={current.order} onChange={(v) => patch({ order: v })} placeholder="auto" />
      </div>

      <label className="flex items-center gap-2 mb-1 cursor-pointer">
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
