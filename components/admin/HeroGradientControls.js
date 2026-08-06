"use client";
import { useState } from "react";
import { hasOverride } from "@/lib/textFormat";

const PRIMARY_DEVICES = [
  ["desktop", "Escritorio"],
  ["tablet", "Tablet"],
  ["mobile", "Celular"],
  ["wide", "Pantalla grande"],
];

const DIRECTION_OPTIONS = [
  { value: "vertical", label: "Vertical" },
  { value: "horizontal", label: "Horizontal" },
  { value: "diagonal", label: "Diagonal" },
];

function effectiveKey(primary, orientation) {
  if (primary === "tablet") return orientation === "landscape" ? "tabletLandscape" : "tabletPortrait";
  if (primary === "mobile") return orientation === "landscape" ? "mobileLandscape" : "mobilePortrait";
  return primary;
}

function GRADIENT_FIELDS_PRESENT(cfg) {
  if (!cfg) return false;
  return ["color", "opacity", "intensity", "height", "direction"].some(
    (k) => cfg[k] !== undefined && cfg[k] !== "" && cfg[k] !== null
  );
}

function primaryHasOverride(fmt, primary) {
  if (primary === "desktop") return GRADIENT_FIELDS_PRESENT(fmt);
  if (primary === "wide") return GRADIENT_FIELDS_PRESENT(fmt?.wide);
  if (primary === "tablet") return GRADIENT_FIELDS_PRESENT(fmt?.tabletPortrait) || GRADIENT_FIELDS_PRESENT(fmt?.tabletLandscape);
  if (primary === "mobile") return GRADIENT_FIELDS_PRESENT(fmt?.mobilePortrait) || GRADIENT_FIELDS_PRESENT(fmt?.mobileLandscape);
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

// Fully configurable overlay/degradado for the hero banner photo: color,
// opacity, intensity, how far it extends ("altura"), and direction, all
// independent per device/orientation. Opt-in — until the admin sets
// something here, Hero.js keeps its original hand-tuned default look.
export default function HeroGradientControls({ label = "Degradado del banner", value, onChange, legacyIntensity }) {
  const fmt = value || {};
  const [primary, setPrimary] = useState("desktop");
  const [orientation, setOrientation] = useState("portrait");
  const device = effectiveKey(primary, orientation);
  const current = device === "desktop" ? fmt : fmt[device] || {};
  // If nothing was set yet anywhere and there's an old single "intensidad"
  // value from the previous version of this control, show it pre-filled on
  // the desktop tab so nothing looks reset when this panel first opens.
  const hasAnything = PRIMARY_DEVICES.some(([k]) => primaryHasOverride(fmt, k));
  const intensityDisplay =
    device === "desktop" && current.intensity === undefined && !hasAnything && legacyIntensity
      ? legacyIntensity
      : current.intensity;

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

  return (
    <div className="border border-black/10 rounded-lg p-4 bg-black/[0.015]">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div>
          <p className="font-body text-[11px] font-semibold text-primary/60 uppercase tracking-wide">
            {label}
            {!hasAnything && <span className="font-normal normal-case text-primary/35"> · sin cambios (diseño original)</span>}
          </p>
          <p className="font-body text-[11px] text-primary/40 normal-case mt-0.5">
            Controla el oscurecido sobre la foto del banner para que el texto se lea bien. Cada dispositivo es independiente.
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
            {GRADIENT_FIELDS_PRESENT(fmt[device]) ? "Personalizado" : "Hereda de Escritorio"} — solo aplica en {PRIMARY_DEVICES.find(([k]) => k === primary)[1].toLowerCase()}
            {primary !== "wide" ? ` ${orientation === "landscape" ? "horizontal" : "vertical"}` : ""}.
          </p>
          <button type="button" onClick={copyFromDesktop} className="shrink-0 text-[10.5px] font-body text-tertiary hover:underline">
            Copiar de Escritorio
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="font-body text-[10.5px] text-primary/55 block mb-1">Color</label>
          <input
            type="text"
            value={current.color ?? ""}
            onChange={(e) => patch({ color: e.target.value })}
            placeholder="#0D1020"
            className="w-full rounded border border-black/10 px-2 py-1.5 text-xs font-body"
          />
        </div>
        <div>
          <label className="font-body text-[10.5px] text-primary/55 block mb-1">Dirección</label>
          <select
            value={current.direction ?? ""}
            onChange={(e) => patch({ direction: e.target.value })}
            className="w-full rounded border border-black/10 px-2 py-1.5 text-xs font-body"
          >
            <option value="">Vertical (por defecto)</option>
            {DIRECTION_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        <NumField label="Opacidad (%)" value={current.opacity} onChange={(v) => patch({ opacity: v })} step={5} placeholder="100" />
        <NumField label="Intensidad general (%)" value={intensityDisplay} onChange={(v) => patch({ intensity: v })} step={5} placeholder="100" />
        <NumField
          label="Altura del degradado (%)"
          value={current.height}
          onChange={(v) => patch({ height: v })}
          step={5}
          placeholder="60"
        />
      </div>
      <p className="font-body text-[10.5px] text-primary/40 mb-2">
        "Opacidad" e "Intensidad" se combinan (100% + 100% = como está). "Altura" define hasta dónde sube o llega el degradado antes de desvanecerse del todo — más alto tapa más foto, más bajo la deja más despejada.
      </p>

      <button type="button" onClick={resetDevice} className="mt-1 text-[10.5px] font-body text-red-500/80 hover:underline">
        Restablecer {device === "desktop" ? "todo" : PRIMARY_DEVICES.find(([k]) => k === primary)[1].toLowerCase()}
      </button>
    </div>
  );
}
