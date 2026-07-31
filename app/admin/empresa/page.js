"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField, AdminTextarea } from "@/components/admin/AdminField";
import AdminGalleryManager from "@/components/admin/AdminGalleryManager";
import TextFormatControls from "@/components/admin/TextFormatControls";
import SaveBar from "@/components/admin/SaveBar";

export default function AdminEmpresaPage() {
  const { content, setContent, save, saving, message, loading } = useAdmin();
  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  const e = content.pages.empresa;
  const fmt = e.formats || {};
  function updateEmpresa(patch) {
    setContent({ ...content, pages: { ...content.pages, empresa: { ...e, ...patch } } });
  }
  function updateFormat(key, value) {
    updateEmpresa({ formats: { ...fmt, [key]: value } });
  }
  function updateValor(i, patch) {
    const valores = e.valores.map((v, idx) => (idx === i ? { ...v, ...patch } : v));
    updateEmpresa({ valores });
  }
  function updateValorFormat(i, key, value) {
    const v = e.valores[i];
    updateValor(i, { formats: { ...(v.formats || {}), [key]: value } });
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
        <p className="font-body text-sm font-semibold text-primary">Banner superior</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <AdminField label="Subtítulo pequeño (eyebrow)" value={e.eyebrow} onChange={(v) => updateEmpresa({ eyebrow: v })} />
            <TextFormatControls label="Formato: eyebrow" value={fmt.eyebrow} onChange={(v) => updateFormat("eyebrow", v)} showFirstLine={false} />
          </div>
          <div className="space-y-2">
            <AdminField label="Título" value={e.heroTitulo} onChange={(v) => updateEmpresa({ heroTitulo: v })} />
            <TextFormatControls label="Formato: título" value={fmt.heroTitulo} onChange={(v) => updateFormat("heroTitulo", v)} />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <p className="font-body text-sm font-semibold text-primary">Historia (aparece primero en la página)</p>
        <AdminField label="Subtítulo de la sección" value={e.historia.titulo} onChange={(v) => updateEmpresa({ historia: { ...e.historia, titulo: v } })} />
        <TextFormatControls label="Formato: subtítulo de la sección" value={fmt.historiaTitulo} onChange={(v) => updateFormat("historiaTitulo", v)} showFirstLine={false} />
        <AdminTextarea label="Texto" rows={8} value={e.historia.texto} onChange={(v) => updateEmpresa({ historia: { ...e.historia, texto: v } })} />
        <TextFormatControls label="Formato: texto de la historia" value={fmt.historiaTexto} onChange={(v) => updateFormat("historiaTexto", v)} />
        <AdminGalleryManager
          label="Fotos de historia (rotan automáticamente, se ven grandes debajo del texto)"
          value={e.historia.gallery || []}
          onChange={(v) => updateEmpresa({ historia: { ...e.historia, gallery: v } })}
        />
      </section>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <AdminField label="Subtítulo (por defecto: Misión)" value={e.misionTitulo} onChange={(v) => updateEmpresa({ misionTitulo: v })} />
            <TextFormatControls label="Formato: subtítulo Misión" value={fmt.misionTitulo} onChange={(v) => updateFormat("misionTitulo", v)} />
          </div>
          <div className="space-y-2">
            <AdminField label="Subtítulo (por defecto: Visión)" value={e.visionTitulo} onChange={(v) => updateEmpresa({ visionTitulo: v })} />
            <TextFormatControls label="Formato: subtítulo Visión" value={fmt.visionTitulo} onChange={(v) => updateFormat("visionTitulo", v)} />
          </div>
        </div>
        <AdminTextarea label="Misión" rows={4} value={e.mision} onChange={(v) => updateEmpresa({ mision: v })} />
        <TextFormatControls label="Formato: texto de Misión" value={fmt.misionTexto} onChange={(v) => updateFormat("misionTexto", v)} />
        <AdminTextarea label="Visión" rows={4} value={e.vision} onChange={(v) => updateEmpresa({ vision: v })} />
        <TextFormatControls label="Formato: texto de Visión" value={fmt.visionTexto} onChange={(v) => updateFormat("visionTexto", v)} />
      </section>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <AdminField label="Subtítulo de la sección (por defecto: Nuestros Valores)" value={e.valoresTitulo} onChange={(v) => updateEmpresa({ valoresTitulo: v })} />
        <TextFormatControls label="Formato: subtítulo de la sección" value={fmt.valoresTitulo} onChange={(v) => updateFormat("valoresTitulo", v)} showFirstLine={false} />
        <p className="font-body text-sm font-semibold text-primary">Valores</p>
        {e.valores.map((v, i) => {
          const vfmt = v.formats || {};
          return (
            <div key={i} className="grid sm:grid-cols-2 gap-3 items-start border border-black/10 rounded-xl p-4">
              <div className="space-y-2">
                <AdminField label="Nombre" value={v.nombre} onChange={(val) => updateValor(i, { nombre: val })} />
                <TextFormatControls label="Formato: nombre" value={vfmt.nombre} onChange={(val) => updateValorFormat(i, "nombre", val)} showFirstLine={false} />
              </div>
              <div className="space-y-2">
                <AdminTextarea label="Descripción" rows={2} value={v.descripcion} onChange={(val) => updateValor(i, { descripcion: val })} />
                <TextFormatControls label="Formato: descripción" value={vfmt.descripcion} onChange={(val) => updateValorFormat(i, "descripcion", val)} />
                <button onClick={() => removeValor(i)} className="text-xs font-body text-red-600 hover:underline mt-2">Eliminar valor</button>
              </div>
            </div>
          );
        })}
        <button onClick={addValor} className="text-sm font-body text-tertiary hover:underline">+ Agregar valor</button>
      </section>

      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
