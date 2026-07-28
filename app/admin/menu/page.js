"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField } from "@/components/admin/AdminField";
import SaveBar from "@/components/admin/SaveBar";

export default function AdminMenuPage() {
  const { content, setContent, save, saving, message, loading } = useAdmin();
  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  function updateItem(i, patch) {
    const menu = content.menu.map((item, idx) => (idx === i ? { ...item, ...patch } : item));
    setContent({ ...content, menu });
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

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Menú de navegación</h1>
      <div className="space-y-4">
        {content.menu.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-black/5 p-5 flex gap-4 items-end">
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
        ))}
        <button onClick={add} className="text-sm font-body text-tertiary hover:underline">+ Agregar ítem al menú</button>
      </div>
      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
