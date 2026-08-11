"use client";
import { useState } from "react";
import ImageCropControls from "./ImageCropControls";

// `formats` (optional): array parallel to `value`, one { manual, zoom, posX,
// posY } object per image, used only when `enableZoom` is on. When left out
// entirely (the default), this component behaves exactly as before — a
// plain, reorderable list of uploaded images with a single `onChange(images)`
// callback — so the other places that use it are completely unaffected.
export default function AdminGalleryManager({ label, value, onChange, helpText, formats, onChangeWithFormats, enableZoom = false }) {
  const images = Array.isArray(value) ? value : [];
  const fmts = Array.isArray(formats) ? formats : [];
  const [uploading, setUploading] = useState(false);
  const [openIdx, setOpenIdx] = useState(null);

  function emit(nextImages, nextFormats) {
    if (enableZoom && onChangeWithFormats) {
      onChangeWithFormats(nextImages, nextFormats);
    } else {
      onChange(nextImages);
    }
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    const uploaded = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        uploaded.push(data.url);
      }
    }
    setUploading(false);
    emit([...images, ...uploaded], [...fmts, ...uploaded.map(() => ({}))]);
    e.target.value = "";
  }

  function remove(i) {
    emit(images.filter((_, idx) => idx !== i), fmts.filter((_, idx) => idx !== i));
  }
  function moveUp(i) {
    if (i === 0) return;
    const nextImages = [...images];
    [nextImages[i - 1], nextImages[i]] = [nextImages[i], nextImages[i - 1]];
    const nextFmts = [...fmts];
    [nextFmts[i - 1], nextFmts[i]] = [nextFmts[i], nextFmts[i - 1]];
    emit(nextImages, nextFmts);
  }
  function moveDown(i) {
    if (i === images.length - 1) return;
    const nextImages = [...images];
    [nextImages[i + 1], nextImages[i]] = [nextImages[i], nextImages[i + 1]];
    const nextFmts = [...fmts];
    [nextFmts[i + 1], nextFmts[i]] = [nextFmts[i], nextFmts[i + 1]];
    emit(nextImages, nextFmts);
  }
  function updateFormat(i, patch) {
    const nextFmts = [...fmts];
    while (nextFmts.length < images.length) nextFmts.push({});
    nextFmts[i] = { ...(nextFmts[i] || {}), ...patch };
    emit(images, nextFmts);
  }
  // Used by ImageCropControls, which manages the full per-device object
  // itself and needs to fully REPLACE the entry (not shallow-merge) so its
  // "Restablecer" button can actually delete a device key.
  function replaceFormat(i, fullValue) {
    const nextFmts = [...fmts];
    while (nextFmts.length < images.length) nextFmts.push({});
    nextFmts[i] = fullValue;
    emit(images, nextFmts);
  }

  return (
    <div>
      <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">{label}</label>
      {helpText && <p className="font-body text-xs text-primary/50 mb-3">{helpText}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {images.map((src, i) => {
            const f = fmts[i] || {};
            return (
              <div key={src + i} className="col-span-1">
                <div className="relative group border border-black/10 rounded-lg overflow-hidden">
                  <img src={src} alt="" className="h-28 w-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveUp(i)}
                        disabled={i === 0}
                        className="h-7 w-7 rounded-full bg-white text-primary text-xs font-bold disabled:opacity-30 hover:bg-accent hover:text-white"
                        aria-label="Mover antes"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(i)}
                        disabled={i === images.length - 1}
                        className="h-7 w-7 rounded-full bg-white text-primary text-xs font-bold disabled:opacity-30 hover:bg-accent hover:text-white"
                        aria-label="Mover después"
                      >
                        →
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(i)}
                        className="h-7 w-7 rounded-full bg-white text-red-600 text-xs font-bold hover:bg-red-600 hover:text-white"
                        aria-label="Eliminar"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {i + 1}
                  </span>
                  {enableZoom && f.manual && (
                    <span className="absolute top-1 right-1 bg-tertiary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Ajustada
                    </span>
                  )}
                </div>
                {enableZoom && (
                  <button
                    type="button"
                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                    className="mt-1 w-full text-[10.5px] font-body text-tertiary hover:underline"
                  >
                    {openIdx === i ? "Cerrar ajuste" : "Zoom / encuadre"}
                  </button>
                )}
                {enableZoom && openIdx === i && (
                  <div className="mt-2 border border-black/10 rounded-lg p-3 bg-black/[0.02] space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer mb-1">
                      <input
                        type="checkbox"
                        checked={!!f.manual}
                        onChange={(e) => updateFormat(i, { manual: e.target.checked })}
                        className="rounded border-black/20"
                      />
                      <span className="font-body text-[11px] text-primary/70">Ajustar manualmente esta foto</span>
                    </label>
                    {f.manual && (
                      <ImageCropControls value={f} onChange={(v) => replaceFormat(i, v)} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <label className="cursor-pointer inline-flex items-center justify-center rounded-full border border-black/15 text-primary text-xs font-semibold px-4 py-2 hover:bg-black/5 transition-colors">
        {uploading ? "Subiendo..." : "+ Agregar imágenes"}
        <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
      </label>
    </div>
  );
}
