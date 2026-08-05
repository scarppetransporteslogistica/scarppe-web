"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField, AdminTextarea } from "@/components/admin/AdminField";
import AdminImageUpload from "@/components/admin/AdminImageUpload";
import AdminGalleryManager from "@/components/admin/AdminGalleryManager";
import TextFormatControls from "@/components/admin/TextFormatControls";
import BoxFormatControls from "@/components/admin/BoxFormatControls";
import ImageFocalControls from "@/components/admin/ImageFocalControls";
import SaveBar from "@/components/admin/SaveBar";

export default function AdminInicioPage() {
  const { content, setContent, save, saving, message, loading } = useAdmin();
  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  const inicio = content.pages.inicio;
  const fmt = inicio.formats || {};
  function update(patch) {
    setContent({ ...content, pages: { ...content.pages, inicio: { ...inicio, ...patch } } });
  }
  function updateFormat(key, value) {
    update({ formats: { ...fmt, [key]: value } });
  }
  function updateStat(i, patch) {
    const stats = inicio.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    update({ stats });
  }
  function updateStatFormat(i, key, value) {
    const stats = inicio.stats.map((s, idx) =>
      idx === i ? { ...s, formats: { ...(s.formats || {}), [key]: value } } : s
    );
    update({ stats });
  }
  function updateBadge(i, value) {
    const badges = (inicio.badges || []).map((b, idx) => (idx === i ? value : b));
    update({ badges });
  }
  function addBadge() {
    update({ badges: [...(inicio.badges || []), "Nuevo destacado"], badgeFormats: [...(inicio.badgeFormats || []), {}] });
  }
  function removeBadge(i) {
    update({
      badges: (inicio.badges || []).filter((_, idx) => idx !== i),
      badgeFormats: (inicio.badgeFormats || []).filter((_, idx) => idx !== i),
    });
  }
  function updateBadgeFormat(i, key, value) {
    const badgeFormats = [...(inicio.badgeFormats || [])];
    while (badgeFormats.length < (inicio.badges || []).length) badgeFormats.push({});
    badgeFormats[i] = { ...(badgeFormats[i] || {}), [key]: value };
    update({ badgeFormats });
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Inicio (banner principal)</h1>
      <div className="space-y-6 bg-white rounded-2xl border border-black/5 p-6">
        <AdminGalleryManager
          label="Fotos de fondo del banner (rotan automáticamente)"
          helpText="Subí varias fotos: van a alternarse solas en el banner principal. Usá la flecha para reordenar."
          value={inicio.heroImages || (inicio.heroImage ? [inicio.heroImage] : [])}
          onChange={(v) => update({ heroImages: v })}
        />
        <AdminField label="Video de fondo (URL, opcional — reemplaza la foto si se completa)" value={inicio.heroVideo} onChange={(v) => update({ heroVideo: v })} />
        <ImageFocalControls
          label="Encuadre de las fotos de fondo del banner"
          value={fmt.heroImagenFoco}
          onChange={(v) => updateFormat("heroImagenFoco", v)}
        />

        <AdminField label="Título principal" value={inicio.heroTitle} onChange={(v) => update({ heroTitle: v })} />
        <TextFormatControls label="Formato: título principal" value={fmt.heroTitle} onChange={(v) => updateFormat("heroTitle", v)} />

        <AdminField label="Subtítulo" value={inicio.heroSubtitle} onChange={(v) => update({ heroSubtitle: v })} />
        <TextFormatControls label="Formato: subtítulo" value={fmt.heroSubtitle} onChange={(v) => updateFormat("heroSubtitle", v)} />

        <AdminTextarea label="Texto descriptivo" value={inicio.heroText} onChange={(v) => update({ heroText: v })} />
        <TextFormatControls label="Formato: texto descriptivo" value={fmt.heroText} onChange={(v) => updateFormat("heroText", v)} />

        <TextFormatControls
          label='Formato: botón "Conocer Nuestros Servicios"'
          value={fmt.heroCtas}
          onChange={(v) => updateFormat("heroCtas", v)}
          showFirstLine={false}
        />
        <BoxFormatControls
          label='Tamaño del botón "Conocer Nuestros Servicios"'
          value={fmt.heroCtaBox}
          onChange={(v) => updateFormat("heroCtaBox", v)}
        />

        <div>
          <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">Tamaño de las letras del banner (%)</label>
          <input
            type="number"
            min="50"
            max="250"
            step="5"
            value={inicio.heroTextScale || 100}
            onChange={(e) => update({ heroTextScale: e.target.value })}
            className="w-full sm:w-40 rounded-lg border border-black/10 px-4 py-2.5 font-body text-primary text-sm focus:outline-none focus:ring-2 focus:ring-tertiary/40"
          />
          <p className="font-body text-xs text-primary/50 mt-1.5">100% es el tamaño actual. Poné, por ejemplo, 130 para agrandar un 30%.</p>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-black/5 p-6">
        <p className="font-body text-sm font-semibold text-primary mb-4">Destacados (franja debajo del banner)</p>
        <div className="space-y-5 mb-2">
          {(inicio.badges || []).map((b, i) => {
            const bfmt = (inicio.badgeFormats || [])[i] || {};
            return (
              <div key={i} className="border border-black/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <AdminField label={`Destacado ${i + 1}`} value={b} onChange={(v) => updateBadge(i, v)} />
                  </div>
                  <button onClick={() => removeBadge(i)} className="h-9 w-9 rounded-full border border-red-200 text-red-600 hover:bg-red-50 shrink-0 mt-6">✕</button>
                </div>
                <TextFormatControls
                  label="Formato del texto"
                  value={bfmt.text}
                  onChange={(v) => updateBadgeFormat(i, "text", v)}
                  showFirstLine={false}
                />
                <BoxFormatControls
                  label="Tamaño del cuadro"
                  value={bfmt.box}
                  onChange={(v) => updateBadgeFormat(i, "box", v)}
                />
              </div>
            );
          })}
        </div>
        <button onClick={addBadge} className="text-sm font-body text-tertiary hover:underline">+ Agregar destacado</button>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <p className="font-body text-sm font-semibold text-primary">Sección "Nuestros Servicios" (debajo del banner)</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <AdminField label="Subtítulo pequeño (eyebrow)" value={inicio.serviciosEyebrow} onChange={(v) => update({ serviciosEyebrow: v })} />
            <TextFormatControls label="Formato: eyebrow" value={fmt.serviciosEyebrow} onChange={(v) => updateFormat("serviciosEyebrow", v)} showFirstLine={false} />
          </div>
          <div className="space-y-2">
            <AdminField label="Título" value={inicio.serviciosTitulo} onChange={(v) => update({ serviciosTitulo: v })} />
            <TextFormatControls label="Formato: título" value={fmt.serviciosTitulo} onChange={(v) => updateFormat("serviciosTitulo", v)} />
          </div>
        </div>
        <TextFormatControls
          label='Formato: enlace "Ver todos los servicios"'
          value={fmt.serviciosCta}
          onChange={(v) => updateFormat("serviciosCta", v)}
          showFirstLine={false}
        />
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-black/5 p-6">
        <p className="font-body text-sm font-semibold text-primary mb-4">Indicadores de trayectoria</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {inicio.stats.map((s, i) => {
            const sfmt = s.formats || {};
            return (
              <div key={i} className="border border-black/10 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <AdminField label="Valor" value={s.value} onChange={(v) => updateStat(i, { value: v })} />
                  <AdminField label="Etiqueta" value={s.label} onChange={(v) => updateStat(i, { label: v })} />
                </div>
                <TextFormatControls
                  label="Formato: valor (el número grande)"
                  value={sfmt.valor}
                  onChange={(v) => updateStatFormat(i, "valor", v)}
                  showFirstLine={false}
                />
                <TextFormatControls
                  label="Formato: etiqueta"
                  value={sfmt.label}
                  onChange={(v) => updateStatFormat(i, "label", v)}
                  showFirstLine={false}
                />
                <BoxFormatControls
                  label="Tamaño del cuadro"
                  value={sfmt.box}
                  onChange={(v) => updateStatFormat(i, "box", v)}
                />
              </div>
            );
          })}
        </div>
        <div>
          <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">Tamaño general de los números (%)</label>
          <input
            type="number"
            min="50"
            max="250"
            step="5"
            value={inicio.statsValueScale || 100}
            onChange={(e) => update({ statsValueScale: e.target.value })}
            className="w-full sm:w-40 rounded-lg border border-black/10 px-4 py-2.5 font-body text-primary text-sm focus:outline-none focus:ring-2 focus:ring-tertiary/40"
          />
          <p className="font-body text-xs text-primary/50 mt-1.5">
            100% es el tamaño actual y afecta a los 4 números a la vez. Si querés ajustar un número en particular, o por dispositivo, usá el control "Formato: valor" de ese indicador arriba.
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <div className="space-y-2">
          <AdminField
            label='Subtítulo pequeño de la sección "Trayectoria" (bloque con la reseña de la empresa)'
            value={inicio.trayectoriaEyebrow}
            onChange={(v) => update({ trayectoriaEyebrow: v })}
          />
          <TextFormatControls label="Formato: eyebrow trayectoria" value={fmt.trayectoriaEyebrow} onChange={(v) => updateFormat("trayectoriaEyebrow", v)} showFirstLine={false} />
        </div>
        <TextFormatControls
          label='Formato: título "Más de 80 años moviendo la carga..."'
          value={fmt.trayectoriaTitulo}
          onChange={(v) => updateFormat("trayectoriaTitulo", v)}
        />
        <TextFormatControls
          label="Formato: párrafo (primer párrafo de la Historia de Empresa)"
          value={fmt.trayectoriaTexto}
          onChange={(v) => updateFormat("trayectoriaTexto", v)}
        />
        <TextFormatControls
          label='Formato: enlace "Conocer la empresa"'
          value={fmt.trayectoriaCta}
          onChange={(v) => updateFormat("trayectoriaCta", v)}
          showFirstLine={false}
        />
      </div>
      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
