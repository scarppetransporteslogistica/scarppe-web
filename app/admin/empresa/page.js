"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField, AdminTextarea } from "@/components/admin/AdminField";
import AdminImageUpload from "@/components/admin/AdminImageUpload";
import AdminGalleryManager from "@/components/admin/AdminGalleryManager";
import SaveBar from "@/components/admin/SaveBar";

export default function AdminEmpresaPage() {
  const { content, setContent, save, saving, message, loading } = useAdmin();
  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  const e = content.pages.empresa;
  function updateEmpresa(patch) {
    setContent({ ...content, pages: { ...content.pages, empresa: { ...e, ...patch } } });
  }
  function updateGalleryImage(i, url) {
    const gallery = e.politicaGestion.gallery.map((g, idx) => (idx === i ? url : g));
    updateEmpresa({ politicaGestion: { ...e.politicaGestion, gallery } });
  }
  function addGalleryImage() {
    updateEmpresa({ politicaGestion: { ...e.politicaGestion, gallery: [...e.politicaGestion.gallery, ""] } });
  }
  function removeGalleryImage(i) {
    updateEmpresa({ politicaGestion: { ...e.politicaGestion, gallery: e.politicaGestion.gallery.filter((_, idx) => idx !== i) } });
  }
  function updateTimeline(i, patch) {
    const timeline = e.historia.timeline.map((t, idx) => (idx === i ? { ...t, ...patch } : t));
    updateEmpresa({ historia: { ...e.historia, timeline } });
  }
  function addTimeline() {
    updateEmpresa({ historia: { ...e.historia, timeline: [...e.historia.timeline, { anio: "", hito: "", imagen: "" }] } });
  }
  function removeTimeline(i) {
    updateEmpresa({ historia: { ...e.historia, timeline: e.historia.timeline.filter((_, idx) => idx !== i) } });
  }
  function updateValor(i, patch) {
    const valores = e.valores.map((v, idx) => (idx === i ? { ...v, ...patch } : v));
    updateEmpresa({ valores });
  }
  function addValor() {
    updateEmpresa({ valores: [...e.valores, { nombre: "", descripcion: "" }] });
  }
  function removeValor(i) {
    updateEmpresa({ valores: e.valores.filter((_, idx) => idx !== i) });
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Empresa</h1>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <p className="font-body text-sm font-semibold text-primary">Política de Gestión</p>
        <AdminField label="Subtítulo de la sección" value={e.politicaGestion.titulo} onChange={(v) => updateEmpresa({ politicaGestion: { ...e.politicaGestion, titulo: v } })} />
        <AdminTextarea label="Texto" rows={8} value={e.politicaGestion.texto} onChange={(v) => updateEmpresa({ politicaGestion: { ...e.politicaGestion, texto: v } })} />
        <p className="font-body text-sm font-medium text-primary/80">Galería de imágenes (carrusel)</p>
        {e.politicaGestion.gallery.map((g, i) => (
          <div key={i} className="flex items-center gap-3">
            <AdminImageUpload label={`Imagen ${i + 1}`} value={g} onChange={(v) => updateGalleryImage(i, v)} />
            <button onClick={() => removeGalleryImage(i)} className="h-9 w-9 rounded-full border border-red-200 text-red-600 hover:bg-red-50 shrink-0">✕</button>
          </div>
        ))}
        <button onClick={addGalleryImage} className="text-sm font-body text-tertiary hover:underline">+ Agregar imagen</button>
      </section>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <p className="font-body text-sm font-semibold text-primary">Historia (aparece primero en la página)</p>
        <AdminField label="Subtítulo de la sección" value={e.historia.titulo} onChange={(v) => updateEmpresa({ historia: { ...e.historia, titulo: v } })} />
        <AdminTextarea label="Texto" rows={8} value={e.historia.texto} onChange={(v) => updateEmpresa({ historia: { ...e.historia, texto: v } })} />
        <AdminGalleryManager
          label="Foto grande de historia (rota automáticamente, se ve en tamaño grande)"
          value={e.historia.gallery || []}
          onChange={(v) => updateEmpresa({ historia: { ...e.historia, gallery: v } })}
        />
        <p className="font-body text-sm font-medium text-primary/80">Línea de tiempo</p>
        {e.historia.timeline.map((t, i) => (
          <div key={i} className="border border-black/10 rounded-xl p-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <AdminField label="Año / período" value={t.anio} onChange={(v) => updateTimeline(i, { anio: v })} />
              <AdminImageUpload label="Foto" value={t.imagen} onChange={(v) => updateTimeline(i, { imagen: v })} />
            </div>
            <AdminTextarea label="Hito" rows={2} value={t.hito} onChange={(v) => updateTimeline(i, { hito: v })} />
            <button onClick={() => removeTimeline(i)} className="text-xs font-body text-red-600 hover:underline">Eliminar hito</button>
          </div>
        ))}
        <button onClick={addTimeline} className="text-sm font-body text-tertiary hover:underline">+ Agregar hito</button>
      </section>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <AdminField label="Subtítulo (por defecto: Misión)" value={e.misionTitulo} onChange={(v) => updateEmpresa({ misionTitulo: v })} />
          <AdminField label="Subtítulo (por defecto: Visión)" value={e.visionTitulo} onChange={(v) => updateEmpresa({ visionTitulo: v })} />
        </div>
        <AdminTextarea label="Misión" rows={4} value={e.mision} onChange={(v) => updateEmpresa({ mision: v })} />
        <AdminTextarea label="Visión" rows={4} value={e.vision} onChange={(v) => updateEmpresa({ vision: v })} />
      </section>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <AdminField label="Subtítulo de la sección (por defecto: Nuestros Valores)" value={e.valoresTitulo} onChange={(v) => updateEmpresa({ valoresTitulo: v })} />
        <p className="font-body text-sm font-semibold text-primary">Valores</p>
        {e.valores.map((v, i) => (
          <div key={i} className="grid sm:grid-cols-2 gap-3 items-start border border-black/10 rounded-xl p-4">
            <AdminField label="Nombre" value={v.nombre} onChange={(val) => updateValor(i, { nombre: val })} />
            <div>
              <AdminTextarea label="Descripción" rows={2} value={v.descripcion} onChange={(val) => updateValor(i, { descripcion: val })} />
              <button onClick={() => removeValor(i)} className="text-xs font-body text-red-600 hover:underline mt-2">Eliminar valor</button>
            </div>
          </div>
        ))}
        <button onClick={addValor} className="text-sm font-body text-tertiary hover:underline">+ Agregar valor</button>
      </section>

      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
