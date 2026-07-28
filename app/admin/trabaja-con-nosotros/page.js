"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField, AdminTextarea } from "@/components/admin/AdminField";
import SaveBar from "@/components/admin/SaveBar";

export default function AdminTrabajaPage() {
  const { content, setContent, save, saving, message, loading } = useAdmin();
  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  const t = content.pages.trabajaConNosotros;
  function update(patch) {
    setContent({ ...content, pages: { ...content.pages, trabajaConNosotros: { ...t, ...patch } } });
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Trabaja con Nosotros</h1>
      <div className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <AdminField label="Título" value={t.titulo} onChange={(v) => update({ titulo: v })} />
        <AdminTextarea label="Texto" rows={4} value={t.texto} onChange={(v) => update({ texto: v })} />
        <AdminField label="E-mail para recibir currículums" value={t.cvEmail} onChange={(v) => update({ cvEmail: v })} />
      </div>
      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
