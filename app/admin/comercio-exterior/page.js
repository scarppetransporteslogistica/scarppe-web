"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField, AdminTextarea } from "@/components/admin/AdminField";
import AdminImageUpload from "@/components/admin/AdminImageUpload";
import TextFormatControls from "@/components/admin/TextFormatControls";
import BoxFormatControls from "@/components/admin/BoxFormatControls";
import SaveBar from "@/components/admin/SaveBar";

export default function AdminComercioExteriorPage() {
  const { content, setContent, save, saving, message, loading } = useAdmin();
  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  const c = content.pages.comercioExterior;
  const fmt = c.formats || {};
  function update(patch) {
    setContent({ ...content, pages: { ...content.pages, comercioExterior: { ...c, ...patch } } });
  }
  function updateFormat(key, value) {
    update({ formats: { ...fmt, [key]: value } });
  }
  function updateBloque(i, patch) {
    const bloques = c.bloques.map((b, idx) => (idx === i ? { ...b, ...patch } : b));
    update({ bloques });
  }
  function updateBloqueFormat(i, key, value) {
    const b = c.bloques[i];
    updateBloque(i, { formats: { ...(b.formats || {}), [key]: value } });
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
        <AdminField label="Subtítulo pequeño (eyebrow)" value={c.eyebrow} onChange={(v) => update({ eyebrow: v })} />
        <TextFormatControls label="Formato: eyebrow" value={fmt.eyebrow} onChange={(v) => updateFormat("eyebrow", v)} showFirstLine={false} />
        <AdminField label="Título" value={c.titulo} onChange={(v) => update({ titulo: v })} />
        <TextFormatControls label="Formato: título" value={fmt.titulo} onChange={(v) => updateFormat("titulo", v)} />
        <AdminTextarea label="Texto introductorio" rows={4} value={c.intro} onChange={(v) => update({ intro: v })} />
        <TextFormatControls label="Formato: texto introductorio" value={fmt.intro} onChange={(v) => updateFormat("intro", v)} />
        <AdminTextarea label="Aviso importante (Scarppe no posee despachantes propios)" rows={3} value={c.aviso} onChange={(v) => update({ aviso: v })} />
        <TextFormatControls label="Formato: aviso importante" value={fmt.aviso} onChange={(v) => updateFormat("aviso", v)} />
        <AdminImageUpload
          label="Fotografía grande (columna derecha de la sección — una sola foto, sin carrusel)"
          value={c.heroImage || (c.gallery && c.gallery[0]) || ""}
          onChange={(v) => update({ heroImage: v })}
        />
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <p className="font-body text-sm font-semibold text-primary">Bloques (Coordinación, Depósitos Fiscales, Asesoramiento)</p>
        {c.bloques.map((b, i) => {
          const bfmt = b.formats || {};
          return (
            <div key={i} className="border border-black/10 rounded-xl p-4 space-y-3">
              <AdminField label="Título" value={b.titulo} onChange={(v) => updateBloque(i, { titulo: v })} />
              <TextFormatControls label={`Formato: título del bloque ${i + 1}`} value={bfmt.titulo} onChange={(v) => updateBloqueFormat(i, "titulo", v)} previewText={b.titulo} />
              <AdminTextarea label="Texto" rows={3} value={b.texto} onChange={(v) => updateBloque(i, { texto: v })} />
              <TextFormatControls label={`Formato: texto del bloque ${i + 1}`} value={bfmt.texto} onChange={(v) => updateBloqueFormat(i, "texto", v)} previewText={b.texto} />
              <button onClick={() => removeBloque(i)} className="text-xs font-body text-red-600 hover:underline">Eliminar bloque</button>
            </div>
          );
        })}
        <button onClick={addBloque} className="text-sm font-body text-tertiary hover:underline">+ Agregar bloque</button>
      </div>
      <div className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <p className="font-body text-sm font-semibold text-primary">Cuadro lateral "¿Necesitás coordinar una operación?"</p>
        <TextFormatControls label="Formato: título del cuadro" value={fmt.ctaTitulo} onChange={(v) => updateFormat("ctaTitulo", v)} />
        <TextFormatControls label="Formato: párrafo del cuadro" value={fmt.ctaTexto} onChange={(v) => updateFormat("ctaTexto", v)} />
        <TextFormatControls label='Formato: botón "Solicitar Cotización"' value={fmt.ctaBoton} onChange={(v) => updateFormat("ctaBoton", v)} showFirstLine={false} />
        <BoxFormatControls label="Tamaño del cuadro de cotización" value={fmt.ctaBox} onChange={(v) => updateFormat("ctaBox", v)} />
      </div>
      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
