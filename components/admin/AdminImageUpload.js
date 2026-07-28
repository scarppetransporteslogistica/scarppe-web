"use client";
import { useState } from "react";

export default function AdminImageUpload({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      onChange(data.url);
    }
  }

  return (
    <div>
      <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">{label}</label>
      <div className="flex items-center gap-4">
        {value && <img src={value} alt="" className="h-16 w-24 object-cover rounded-lg border border-black/10" />}
        <label className="cursor-pointer inline-flex items-center justify-center rounded-full border border-black/15 text-primary text-xs font-semibold px-4 py-2 hover:bg-black/5 transition-colors">
          {uploading ? "Subiendo..." : "Subir imagen"}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      </div>
    </div>
  );
}
