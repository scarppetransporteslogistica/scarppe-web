"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField } from "@/components/admin/AdminField";
import TextFormatControls from "@/components/admin/TextFormatControls";
import BoxFormatControls from "@/components/admin/BoxFormatControls";
import SaveBar from "@/components/admin/SaveBar";

export default function AdminMenuPage() {
  const { content, setContent, save, saving, message, loading } = useAdmin();
  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  const settings = content.settings || {};

  function updateItem(i, patch) {
    const menu = content.menu.map((item, idx) => (idx === i ? { ...item, ...patch } : item));
    setContent({ ...content, menu });
  }
  function updateItemFormat(i, value) {
    updateItem(i, { formats: value });
  }
  function move(i, dir) {
    const menu = [...content.menu];
    const j = i + dir;
    if (j < 0 || j >= menu.length) return;
    [menu[i], menu[j]] = [menu[j], menu[i]];
    setContent({ ...content, menu });
  }
  function remove(i) {
    setContent({ ...content, menu: content.menu.filter((_, idx) => idx !== i) });
  }
  function add() {
    setContent({ ...content, menu: [...content.menu, { label: "Nueva página", href: "/" }] });
  }
  function updateSettings(patch) {
    setContent({ ...content, settings: { ...settings, ...patch } });
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Menú de navegación</h1>
      <div className="space-y-4">
        {content.menu.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-black/5 p-5 space-y-3">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <AdminField label="Texto" value={item.label} onChange={(v) => updateItem(i, { label: v })} />
              </div>
              <div className="flex-1">
                <AdminField label="Enlace (ruta)" value={item.href} onChange={(v) => updateItem(i, { href: v })} />
              </div>
              <div className="flex gap-2 pb-1">
                <button onClick={() => move(i, -1)} className="h-9 w-9 rounded-full border border-black/10 hover:bg-black/5">↑</button>
                <button onClick={() => move(i, 1)} className="h-9 w-9 rounded-full border border-black/10 hover:bg-black/5">↓</button>
                <button onClick={() => remove(i)} className="h-9 w-9 rounded-full border border-red-200 text-red-600 hover:bg-red-50">✕</button>
              </div>
            </div>
            <TextFormatControls label={`Formato: ítem del menú "${item.label || i + 1}"`} value={item.formats} onChange={(v) => updateItemFormat(i, v)} showFirstLine={false} previewText={item.label} />
          </div>
        ))}
        <button onClick={add} className="text-sm font-body text-tertiary hover:underline">+ Agregar ítem al menú</button>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <p className="font-body text-sm font-semibold text-primary">Botón "Solicitar Cotización" del encabezado</p>
        <TextFormatControls label="Formato del texto" value={settings.headerCta} onChange={(v) => updateSettings({ headerCta: v })} showFirstLine={false} />
        <BoxFormatControls label="Tamaño del botón" value={settings.headerCtaBox} onChange={(v) => updateSettings({ headerCtaBox: v })} />
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <p className="font-body text-sm font-semibold text-primary">Separación entre los ítems del menú</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">Escritorio (separación horizontal, px)</label>
            <input
              type="number"
              min="0"
              max="80"
              step="1"
              value={settings.menuGapDesktop || ""}
              onChange={(e) => updateSettings({ menuGapDesktop: e.target.value })}
              placeholder="Por defecto"
              className="w-full rounded-lg border border-black/10 px-4 py-2.5 font-body text-primary text-sm focus:outline-none focus:ring-2 focus:ring-tertiary/40"
            />
          </div>
          <div>
            <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">Menú desplegable móvil/tablet (separación vertical, px)</label>
            <input
              type="number"
              min="0"
              max="60"
              step="1"
              value={settings.menuGapMobile || ""}
              onChange={(e) => updateSettings({ menuGapMobile: e.target.value })}
              placeholder="Por defecto"
              className="w-full rounded-lg border border-black/10 px-4 py-2.5 font-body text-primary text-sm focus:outline-none focus:ring-2 focus:ring-tertiary/40"
            />
          </div>
        </div>
        <p className="font-body text-xs text-primary/50">Dejalo vacío para usar la separación por defecto. Para agrandar o achicar el texto de cada ítem, o el espacio entre las letras dentro de una palabra, usá el "Formato de este ítem del menú" de cada ítem arriba.</p>
      </div>


      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
