"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField, AdminTextarea } from "@/components/admin/AdminField";
import SaveBar from "@/components/admin/SaveBar";

export default function AdminComercioExteriorPage() {
  const { content, setContent, save, saving, message, loading } = useAdmin();
  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  const c = content.pages.comercioExterior;
  function update(patch) {
    setContent({ ...content, pages: { ...content.pages, comercioExterior: { ...c, ...patch } } });
  }
  function updateBloque(i, patch) {
    const bloques = c.bloques.map((b, idx) => (idx === i ? { ...b, ...patch } : b));
    update({ bloques });
  }
  function addBloque() {
    update({ bloques: [...c.bloques, { titulo: "", texto: "" }] });
  }
  function removeBloque(i) {
    update({ bloques: c.bloques.filter((_, idx) => idx !== i) });
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Comercio Exterior</h1>
      <div className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <AdminField label="Título" value={c.titulo} onChange={(v) => update({ titulo: v })} />
        <AdminTextarea label="Texto introductorio" rows={4} value={c.intro} onChange={(v) => update({ intro: v })} />
        <AdminTextarea label="Aviso importante (Scarppe no posee despachantes propios)" rows={3} value={c.aviso} onChange={(v) => update({ aviso: v })} />
      </div>
      <div className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <p className="font-body text-sm font-semibold text-primary">Bloques (Coordinación, Depósitos Fiscales, Asesoramiento)</p>
        {c.bloques.map((b, i) => (
          <div key={i} className="border border-black/10 rounded-xl p-4 space-y-3">
            <AdminField label="Título" value={b.titulo} onChange={(v) => updateBloque(i, { titulo: v })} />
            <AdminTextarea label="Texto" rows={3} value={b.texto} onChange={(v) => updateBloque(i, { texto: v })} />
            <button onClick={() => removeBloque(i)} className="text-xs font-body text-red-600 hover:underline">Eliminar bloque</button>
          </div>
        ))}
        <button onClick={addBloque} className="text-sm font-body text-tertiary hover:underline">+ Agregar bloque</button>
      </div>
      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
