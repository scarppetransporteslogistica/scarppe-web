"use client";
import { useState } from "react";

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

function CROP_FIELDS_PRESENT(cfg) {
  if (!cfg) return false;
  return ["zoom", "objectPositionX", "objectPositionY", "posX", "posY"].some(
    (k) => cfg[k] !== undefined && cfg[k] !== "" && cfg[k] !== null
  );
}

function primaryHasOverride(fmt, primary) {
  if (primary === "desktop") return CROP_FIELDS_PRESENT(fmt);
  if (primary === "wide") return CROP_FIELDS_PRESENT(fmt?.wide);
  if (primary === "tablet") return CROP_FIELDS_PRESENT(fmt?.tabletPortrait) || CROP_FIELDS_PRESENT(fmt?.tabletLandscape);
  if (primary === "mobile") return CROP_FIELDS_PRESENT(fmt?.mobilePortrait) || CROP_FIELDS_PRESENT(fmt?.mobileLandscape);
  return false;
}

// Per-photo zoom + posición (encuadre), independiente por dispositivo —
// misma mecánica que HeroGradientControls / ImageFocalControls. `value` es
// el objeto de formato completo de ESA foto ({ manual, zoom, objectPositionX,
// objectPositionY, tabletPortrait: {...}, ... }); `onChange` recibe el
// objeto completo actualizado (reemplaza, no mergea) para que "Restablecer"
// pueda borrar claves de verdad.
export default function ImageCropControls({ value, onChange }) {
  const fmt = value || {};
  const [primary, setPrimary] = useState("desktop");
  const [orientation, setOrientation] = useState("portrait");
  const device = effectiveKey(primary, orientation);
  const current = device === "desktop" ? fmt : fmt[device] || {};
  const hasAnything = PRIMARY_DEVICES.some(([k]) => primaryHasOverride(fmt, k));

  function patch(p) {
    if (device === "desktop") {
      onChange({ ...fmt, ...p });
    } else {
      onChange({ ...fmt, [device]: { ...(fmt[device] || {}), ...p } });
    }
  }

  function resetDevice() {
    if (device === "desktop") {
      const { tabletPortrait, tabletLandscape, mobilePortrait, mobileLandscape, wide, manual, ...rest } = fmt;
      onChange({ manual, tabletPortrait, tabletLandscape, mobilePortrait, mobileLandscape, wide });
    } else {
      const next = { ...fmt };
      delete next[device];
      onChange(next);
    }
  }

  function copyFromDesktop() {
    const { tabletPortrait, tabletLandscape, mobilePortrait, mobileLandscape, wide, manual, ...desktopOnly } = fmt;
    onChange({ ...fmt, [device]: { ...desktopOnly } });
  }

  return (
    <div className="border border-black/10 rounded-lg p-3 bg-black/[0.015]">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="font-body text-[11px] font-semibold text-primary/60 uppercase tracking-wide">
          Encuadre y zoom por dispositivo
          {!hasAnything && <span className="font-normal normal-case text-primary/35"> · mismo encuadre en todos</span>}
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
            {CROP_FIELDS_PRESENT(fmt[device]) ? "Personalizado" : "Hereda de Escritorio"} — solo aplica en {PRIMARY_DEVICES.find(([k]) => k === primary)[1].toLowerCase()}
            {primary !== "wide" ? ` ${orientation === "landscape" ? "horizontal" : "vertical"}` : ""}.
          </p>
          <button type="button" onClick={copyFromDesktop} className="shrink-0 text-[10.5px] font-body text-tertiary hover:underline">
            Copiar de Escritorio
          </button>
        </div>
      )}

      <div>
        <label className="font-body text-[10.5px] text-primary/55 block mb-1">Zoom ({current.zoom || 100}%)</label>
        <input
          type="range"
          min="100"
          max="250"
          value={current.zoom || 100}
          onChange={(e) => patch({ zoom: Number(e.target.value) })}
          className="w-full"
        />
      </div>
      <div>
        <label className="font-body text-[10.5px] text-primary/55 block mb-1">Posición horizontal ({current.objectPositionX ?? current.posX ?? 50}%)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={current.objectPositionX ?? current.posX ?? 50}
          onChange={(e) => patch({ objectPositionX: Number(e.target.value) })}
          className="w-full"
        />
      </div>
      <div className="mb-1">
        <label className="font-body text-[10.5px] text-primary/55 block mb-1">Posición vertical ({current.objectPositionY ?? current.posY ?? 50}%)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={current.objectPositionY ?? current.posY ?? 50}
          onChange={(e) => patch({ objectPositionY: Number(e.target.value) })}
          className="w-full"
        />
      </div>
      <p className="font-body text-[10px] text-primary/45 mb-2">Guardá y mirá el resultado en el sitio; volvé a ajustar si hace falta.</p>

      <button type="button" onClick={resetDevice} className="text-[10.5px] font-body text-red-500/80 hover:underline">
        Restablecer {device === "desktop" ? "todo" : PRIMARY_DEVICES.find(([k]) => k === primary)[1].toLowerCase()}
      </button>
    </div>
  );
}
