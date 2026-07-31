"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField, AdminTextarea } from "@/components/admin/AdminField";
import TextFormatControls from "@/components/admin/TextFormatControls";
import SaveBar from "@/components/admin/SaveBar";

export default function AdminTrabajaPage() {
  const { content, setContent, save, saving, message, loading } = useAdmin();
  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  const t = content.pages.trabajaConNosotros;
  const fmt = t.formats || {};
  function update(patch) {
    setContent({ ...content, pages: { ...content.pages, trabajaConNosotros: { ...t, ...patch } } });
  }
  function updateFormat(key, value) {
    update({ formats: { ...fmt, [key]: value } });
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Trabaja con Nosotros</h1>
      <div className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <AdminField label="Subtítulo pequeño (eyebrow)" value={t.eyebrow} onChange={(v) => update({ eyebrow: v })} />
        <TextFormatControls label="Formato: eyebrow" value={fmt.eyebrow} onChange={(v) => updateFormat("eyebrow", v)} showFirstLine={false} />
        <AdminField label="Título" value={t.titulo} onChange={(v) => update({ titulo: v })} />
        <TextFormatControls label="Formato: título" value={fmt.titulo} onChange={(v) => updateFormat("titulo", v)} />
        <AdminTextarea label="Texto" rows={4} value={t.texto} onChange={(v) => update({ texto: v })} />
        <TextFormatControls label="Formato: texto" value={fmt.texto} onChange={(v) => updateFormat("texto", v)} />
        <AdminField label="E-mail para recibir currículums" value={t.cvEmail} onChange={(v) => update({ cvEmail: v })} />
      </div>
      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
