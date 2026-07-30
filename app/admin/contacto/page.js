"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField } from "@/components/admin/AdminField";
import SaveBar from "@/components/admin/SaveBar";

export default function AdminContactoPage() {
  const { content, setContent, save, saving, message, loading } = useAdmin();
  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  const c = content.pages.contacto;
  function update(patch) {
    setContent({ ...content, pages: { ...content.pages, contacto: { ...c, ...patch } } });
  }
  function updateDirector(i, patch) {
    const directores = c.directores.map((d, idx) => (idx === i ? { ...d, ...patch } : d));
    update({ directores });
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

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Contacto</h1>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <AdminField label="Subtítulo pequeño (eyebrow)" value={c.eyebrow} onChange={(v) => update({ eyebrow: v })} />
          <AdminField label="Título principal" value={c.heroTitulo} onChange={(v) => update({ heroTitulo: v })} />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <p className="font-body text-sm font-semibold text-primary">Directores</p>
        {c.directores.map((d, i) => (
          <div key={i} className="grid sm:grid-cols-2 gap-3 items-end border border-black/10 rounded-xl p-4">
            <AdminField label="Nombre" value={d.nombre} onChange={(v) => updateDirector(i, { nombre: v })} />
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <AdminField label="Teléfono" value={d.telefono} onChange={(v) => updateDirector(i, { telefono: v })} />
              </div>
              <button onClick={() => removeDirector(i)} className="h-9 w-9 rounded-full border border-red-200 text-red-600 hover:bg-red-50 shrink-0">✕</button>
            </div>
          </div>
        ))}
        <button onClick={addDirector} className="text-sm font-body text-tertiary hover:underline">+ Agregar director</button>
      </section>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <AdminField label="Teléfono Gerencia" value={c.gerencia} onChange={(v) => update({ gerencia: v })} />
        <AdminField label="Teléfono Logística" value={c.logistica} onChange={(v) => update({ logistica: v })} />
        <AdminField label="E-mail para recibir cotizaciones" value={c.quoteEmail} onChange={(v) => update({ quoteEmail: v })} />
      </section>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <AdminField label="Subtítulo pequeño (eyebrow)" value={c.oficinasEyebrow} onChange={(v) => update({ oficinasEyebrow: v })} />
          <AdminField label="Título" value={c.oficinasTitulo} onChange={(v) => update({ oficinasTitulo: v })} />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <p className="font-body text-sm font-semibold text-primary">Oficinas / mapas</p>
        {c.mapas.map((m, i) => (
          <div key={i} className="border border-black/10 rounded-xl p-4 space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <AdminField label="País" value={m.pais} onChange={(v) => updateMapa(i, { pais: v })} />
              <AdminField label="Latitud" value={m.lat} onChange={(v) => updateMapa(i, { lat: parseFloat(v) })} />
              <AdminField label="Longitud" value={m.lng} onChange={(v) => updateMapa(i, { lng: parseFloat(v) })} />
            </div>
            <AdminField label="Dirección" value={m.direccion} onChange={(v) => updateMapa(i, { direccion: v })} />
          </div>
        ))}
      </section>

      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
