"use client";
import { useState } from "react";

export default function AdminGalleryManager({ label, value, onChange, helpText }) {
  const images = Array.isArray(value) ? value : [];
  const [uploading, setUploading] = useState(false);

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
    onChange([...images, ...uploaded]);
    e.target.value = "";
  }

  function remove(i) {
    onChange(images.filter((_, idx) => idx !== i));
  }
  function moveUp(i) {
    if (i === 0) return;
    const next = [...images];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  }
  function moveDown(i) {
    if (i === images.length - 1) return;
    const next = [...images];
    [next[i + 1], next[i]] = [next[i], next[i + 1]];
    onChange(next);
  }

  return (
    <div>
      <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">{label}</label>
      {helpText && <p className="font-body text-xs text-primary/50 mb-3">{helpText}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {images.map((src, i) => (
            <div key={src + i} className="relative group border border-black/10 rounded-lg overflow-hidden">
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
            </div>
          ))}
        </div>
      )}

      <label className="cursor-pointer inline-flex items-center justify-center rounded-full border border-black/15 text-primary text-xs font-semibold px-4 py-2 hover:bg-black/5 transition-colors">
        {uploading ? "Subiendo..." : "+ Agregar imágenes"}
        <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
      </label>
    </div>
  );
}
