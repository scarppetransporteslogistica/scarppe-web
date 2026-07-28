"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField, AdminTextarea } from "@/components/admin/AdminField";
import AdminImageUpload from "@/components/admin/AdminImageUpload";
import SaveBar from "@/components/admin/SaveBar";

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminServiciosPage() {
  const { content, setContent, save, saving, message, loading } = useAdmin();
  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  const servicios = content.servicios;

  function updateServicio(i, patch) {
    const next = servicios.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    setContent({ ...content, servicios: next });
  }
  function removeServicio(i) {
    setContent({ ...content, servicios: servicios.filter((_, idx) => idx !== i) });
  }
  function addServicio() {
    setContent({
      ...content,
      servicios: [...servicios, { slug: `nuevo-servicio-${servicios.length + 1}`, nombre: "Nuevo servicio", resumen: "", texto: "", imagen: "" }],
    });
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Servicios</h1>
      <div className="space-y-5">
        {servicios.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <AdminField
                label="Nombre"
                value={s.nombre}
                onChange={(v) => updateServicio(i, { nombre: v, slug: slugify(v) || s.slug })}
              />
              <AdminField label="URL (slug, se genera solo)" value={s.slug} onChange={(v) => updateServicio(i, { slug: v })} />
            </div>
            <AdminField label="Resumen (para la tarjeta)" value={s.resumen} onChange={(v) => updateServicio(i, { resumen: v })} />
            <AdminTextarea label="Texto completo (página propia)" rows={5} value={s.texto} onChange={(v) => updateServicio(i, { texto: v })} />
            <AdminImageUpload label="Imagen" value={s.imagen} onChange={(v) => updateServicio(i, { imagen: v })} />
            <button onClick={() => removeServicio(i)} className="text-xs font-body text-red-600 hover:underline">Eliminar servicio</button>
          </div>
        ))}
        <button onClick={addServicio} className="text-sm font-body text-tertiary hover:underline">+ Agregar servicio</button>
      </div>
      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
