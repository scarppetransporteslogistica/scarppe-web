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

// Focal point / crop control for background-style photos (e.g. the banner
// image): X/Y position (%) per device + orientation, using the same format
// shape as the box-format engine (objectPositionX/objectPositionY), so it
// renders through the same <BoxFormatStyle>. Leaving everything empty keeps
// the site's current default framing untouched.
export default function ImageFocalControls({ label = "Encuadre de la fotografía (punto focal)", value, onChange }) {
  const fmt = value || {};
  const [primary, setPrimary] = useState("desktop");
  const [orientation, setOrientation] = useState("portrait");
  const device = effectiveKey(primary, orientation);
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
      const { tabletPortrait, tabletLandscape, mobilePortrait, mobileLandscape, wide } = fmt;
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
    <div className="border border-black/10 rounded-lg p-3 bg-black/[0.015]">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="font-body text-[11px] font-semibold text-primary/60 uppercase tracking-wide">
          {label}
          {!hasAnything && <span className="font-normal normal-case text-primary/35"> · usa el encuadre actual</span>}
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
            {hasOverride(fmt, device) ? "Personalizado" : "Hereda el encuadre de Escritorio"}.
          </p>
          <button type="button" onClick={copyFromDesktop} className="shrink-0 text-[10.5px] font-body text-tertiary hover:underline">
            Copiar de Escritorio
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-1">
        <div>
          <label className="font-body text-[10.5px] text-primary/55 block mb-1">Posición horizontal (%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={current.objectPositionX ?? 50}
            onChange={(e) => patch({ objectPositionX: Number(e.target.value) })}
            className="w-full"
          />
          <p className="text-[10px] text-primary/45 text-center">{current.objectPositionX ?? "50 (actual)"}</p>
        </div>
        <div>
          <label className="font-body text-[10.5px] text-primary/55 block mb-1">Posición vertical (%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={current.objectPositionY ?? 50}
            onChange={(e) => patch({ objectPositionY: Number(e.target.value) })}
            className="w-full"
          />
          <p className="text-[10px] text-primary/45 text-center">{current.objectPositionY ?? "50 (actual)"}</p>
        </div>
      </div>
      <p className="font-body text-[10.5px] text-primary/45 mb-2">0% = izquierda/arriba, 100% = derecha/abajo. Mové el control y guardá para ver el resultado.</p>

      <button type="button" onClick={resetDevice} className="text-[10.5px] font-body text-red-500/80 hover:underline">
        Restablecer {device === "desktop" ? "todo" : PRIMARY_DEVICES.find(([k]) => k === primary)[1].toLowerCase()}
      </button>
    </div>
  );
}
