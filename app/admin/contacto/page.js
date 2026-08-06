"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField } from "@/components/admin/AdminField";
import TextFormatControls from "@/components/admin/TextFormatControls";
import SaveBar from "@/components/admin/SaveBar";

export default function AdminContactoPage() {
  const { content, setContent, save, saving, message, loading } = useAdmin();
  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  const c = content.pages.contacto;
  const fmt = c.formats || {};
  function update(patch) {
    setContent({ ...content, pages: { ...content.pages, contacto: { ...c, ...patch } } });
  }
  function updateFormat(key, value) {
    update({ formats: { ...fmt, [key]: value } });
  }
  function updateDirector(i, patch) {
    const directores = c.directores.map((d, idx) => (idx === i ? { ...d, ...patch } : d));
    update({ directores });
  }
  function updateDirectorFormat(i, key, value) {
    const d = c.directores[i];
    updateDirector(i, { formats: { ...(d.formats || {}), [key]: value } });
  }
  function addDirector() {
    update({ directores: [...c.directores, { nombre: "", telefono: "" }] });
  }
  function removeDirector(i) {
    update({ directores: c.directores.filter((_, idx) => idx !== i) });
  }
  function updateMapa(i, patch) {
    const mapas = c.mapas.map((m, idx) => (idx === i ? { ...m, ...patch } : m));
    update({ mapas });
  }
  function updateMapaFormat(i, key, value) {
    const m = c.mapas[i];
    updateMapa(i, { formats: { ...(m.formats || {}), [key]: value } });
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Contacto</h1>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <AdminField label="Subtítulo pequeño (eyebrow)" value={c.eyebrow} onChange={(v) => update({ eyebrow: v })} />
            <TextFormatControls label="Formato: eyebrow" value={fmt.eyebrow} onChange={(v) => updateFormat("eyebrow", v)} showFirstLine={false} />
          </div>
          <div className="space-y-2">
            <AdminField label="Título principal" value={c.heroTitulo} onChange={(v) => update({ heroTitulo: v })} />
            <TextFormatControls label="Formato: título" value={fmt.heroTitulo} onChange={(v) => updateFormat("heroTitulo", v)} />
          </div>
        </div>
        <TextFormatControls
          label='Formato: párrafo introductorio ("Completá el formulario o comunicate...")'
          value={fmt.introTexto}
          onChange={(v) => updateFormat("introTexto", v)}
        />
      </section>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <p className="font-body text-sm font-semibold text-primary">Directores</p>
        {c.directores.map((d, i) => {
          const dfmt = d.formats || {};
          return (
            <div key={i} className="grid sm:grid-cols-2 gap-3 items-end border border-black/10 rounded-xl p-4">
              <AdminField label="Nombre" value={d.nombre} onChange={(v) => updateDirector(i, { nombre: v })} />
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <AdminField label="Teléfono" value={d.telefono} onChange={(v) => updateDirector(i, { telefono: v })} />
                </div>
                <button onClick={() => removeDirector(i)} className="h-9 w-9 rounded-full border border-red-200 text-red-600 hover:bg-red-50 shrink-0">✕</button>
              </div>
              <div className="sm:col-span-2">
                <TextFormatControls label={`Formato: línea del director ${i + 1} (nombre — teléfono)`} value={dfmt.linea} onChange={(v) => updateDirectorFormat(i, "linea", v)} showFirstLine={false} previewText={`${d.nombre || ""} — ${d.telefono || ""}`} />
              </div>
            </div>
          );
        })}
        <button onClick={addDirector} className="text-sm font-body text-tertiary hover:underline">+ Agregar director</button>
      </section>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <AdminField label="Teléfono Gerencia" value={c.gerencia} onChange={(v) => update({ gerencia: v })} />
        <TextFormatControls label="Formato: teléfono Gerencia" value={fmt.gerencia} onChange={(v) => updateFormat("gerencia", v)} showFirstLine={false} />
        <AdminField label="Teléfono Logística" value={c.logistica} onChange={(v) => update({ logistica: v })} />
        <TextFormatControls label="Formato: teléfono Logística" value={fmt.logistica} onChange={(v) => updateFormat("logistica", v)} showFirstLine={false} />
        <AdminField label="E-mail para recibir cotizaciones" value={c.quoteEmail} onChange={(v) => update({ quoteEmail: v })} />
        <TextFormatControls label='Formato: título "Formulario de Cotización"' value={fmt.formTitulo} onChange={(v) => updateFormat("formTitulo", v)} showFirstLine={false} />
      </section>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <AdminField label="Subtítulo pequeño (eyebrow)" value={c.oficinasEyebrow} onChange={(v) => update({ oficinasEyebrow: v })} />
            <TextFormatControls label="Formato: eyebrow" value={fmt.oficinasEyebrow} onChange={(v) => updateFormat("oficinasEyebrow", v)} showFirstLine={false} />
          </div>
          <div className="space-y-2">
            <AdminField label="Título" value={c.oficinasTitulo} onChange={(v) => update({ oficinasTitulo: v })} />
            <TextFormatControls label="Formato: título" value={fmt.oficinasTitulo} onChange={(v) => updateFormat("oficinasTitulo", v)} />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <p className="font-body text-sm font-semibold text-primary">Oficinas / mapas</p>
        {c.mapas.map((m, i) => {
          const mfmt = m.formats || {};
          return (
            <div key={i} className="border border-black/10 rounded-xl p-4 space-y-3">
              <div className="grid sm:grid-cols-3 gap-3">
                <AdminField label="País" value={m.pais} onChange={(v) => updateMapa(i, { pais: v })} />
                <AdminField label="Latitud" value={m.lat} onChange={(v) => updateMapa(i, { lat: parseFloat(v) })} />
                <AdminField label="Longitud" value={m.lng} onChange={(v) => updateMapa(i, { lng: parseFloat(v) })} />
              </div>
              <TextFormatControls label={`Formato: nombre del país (oficina ${i + 1})`} value={mfmt.pais} onChange={(v) => updateMapaFormat(i, "pais", v)} showFirstLine={false} previewText={m.pais} />
              <AdminField label="Dirección" value={m.direccion} onChange={(v) => updateMapa(i, { direccion: v })} />
              <TextFormatControls label={`Formato: dirección (oficina ${i + 1})`} value={mfmt.direccion} onChange={(v) => updateMapaFormat(i, "direccion", v)} previewText={m.direccion} />
            </div>
          );
        })}
      </section>

      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
