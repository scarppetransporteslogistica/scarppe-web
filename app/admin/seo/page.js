"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField, AdminTextarea } from "@/components/admin/AdminField";
import SaveBar from "@/components/admin/SaveBar";

const PAGE_LABELS = {
  inicio: "Inicio",
  empresa: "Empresa",
  servicios: "Servicios",
  comercioExterior: "Comercio Exterior",
  contacto: "Contacto",
  trabajaConNosotros: "Trabaja con Nosotros",
};

export default function AdminSeoPage() {
  const { content, setContent, save, saving, message, loading } = useAdmin();
  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  function updateSeo(pageKey, patch) {
    const page = content.pages[pageKey];
    setContent({
      ...content,
      pages: { ...content.pages, [pageKey]: { ...page, seo: { ...page.seo, ...patch } } },
    });
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">SEO por página</h1>
      <div className="space-y-5">
        {Object.entries(PAGE_LABELS).map(([key, label]) => (
          <div key={key} className="bg-white rounded-2xl border border-black/5 p-6 space-y-3">
            <p className="font-body text-sm font-semibold text-primary">{label}</p>
            <AdminField label="Título (meta title)" value={content.pages[key].seo.title} onChange={(v) => updateSeo(key, { title: v })} />
            <AdminTextarea label="Descripción (meta description)" rows={2} value={content.pages[key].seo.description} onChange={(v) => updateSeo(key, { description: v })} />
          </div>
        ))}
      </div>
      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
