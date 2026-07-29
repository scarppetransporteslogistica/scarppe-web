"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField, AdminColor } from "@/components/admin/AdminField";
import AdminImageUpload from "@/components/admin/AdminImageUpload";
import SaveBar from "@/components/admin/SaveBar";
import { GOOGLE_FONT_OPTIONS, TYPOGRAPHY_WEIGHT_OPTIONS, TYPOGRAPHY_SIZE_OPTIONS } from "@/lib/theme";

export default function AdminGeneralPage() {
  const { content, setContent, save, saving, message, loading } = useAdmin();
  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  const s = content.settings;
  const typo = s.typography || {};
  function updateSettings(patch) {
    setContent({ ...content, settings: { ...s, ...patch } });
  }
  function updateTypography(patch) {
    updateSettings({ typography: { ...typo, ...patch } });
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">General</h1>
      <div className="space-y-6 bg-white rounded-2xl border border-black/5 p-6">
        <AdminField label="Nombre del sitio" value={s.siteName} onChange={(v) => updateSettings({ siteName: v })} />
        <AdminImageUpload label="Logo" value={s.logo} onChange={(v) => updateSettings({ logo: v })} />

        <div>
          <p className="font-body text-sm font-semibold text-primary mb-3">Paleta de colores</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <AdminColor label="Color primario (navy)" value={s.colors.primary} onChange={(v) => updateSettings({ colors: { ...s.colors, primary: v } })} />
            <AdminColor label="Color secundario" value={s.colors.secondary} onChange={(v) => updateSettings({ colors: { ...s.colors, secondary: v } })} />
            <AdminColor label="Color terciario" value={s.colors.tertiary} onChange={(v) => updateSettings({ colors: { ...s.colors, tertiary: v } })} />
            <AdminColor label="Color de acento" value={s.colors.accent} onChange={(v) => updateSettings({ colors: { ...s.colors, accent: v } })} />
            <AdminColor label="Color claro (fondos)" value={s.colors.light} onChange={(v) => updateSettings({ colors: { ...s.colors, light: v } })} />
          </div>
        </div>

        <div>
          <p className="font-body text-sm font-semibold text-primary mb-3">Tipografía de títulos</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">Fuente</label>
              <select
                value={s.fonts.heading}
                onChange={(e) => updateSettings({ fonts: { ...s.fonts, heading: e.target.value } })}
                className="w-full rounded-lg border border-black/10 px-4 py-2.5 font-body text-sm"
              >
                {GOOGLE_FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">Grosor (negrita)</label>
              <select
                value={typo.headingWeight || ""}
                onChange={(e) => updateTypography({ headingWeight: e.target.value })}
                className="w-full rounded-lg border border-black/10 px-4 py-2.5 font-body text-sm"
              >
                {TYPOGRAPHY_WEIGHT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">Tamaño</label>
              <select
                value={typo.headingScale || "1"}
                onChange={(e) => updateTypography({ headingScale: e.target.value })}
                className="w-full rounded-lg border border-black/10 px-4 py-2.5 font-body text-sm"
              >
                {TYPOGRAPHY_SIZE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <p className="font-body text-sm font-semibold text-primary mb-3">Tipografía de texto</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">Fuente</label>
              <select
                value={s.fonts.body}
                onChange={(e) => updateSettings({ fonts: { ...s.fonts, body: e.target.value } })}
                className="w-full rounded-lg border border-black/10 px-4 py-2.5 font-body text-sm"
              >
                {GOOGLE_FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">Grosor (negrita)</label>
              <select
                value={typo.bodyWeight || ""}
                onChange={(e) => updateTypography({ bodyWeight: e.target.value })}
                className="w-full rounded-lg border border-black/10 px-4 py-2.5 font-body text-sm"
              >
                {TYPOGRAPHY_WEIGHT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">Tamaño</label>
              <select
                value={typo.bodyScale || "1"}
                onChange={(e) => updateTypography({ bodyScale: e.target.value })}
                className="w-full rounded-lg border border-black/10 px-4 py-2.5 font-body text-sm"
              >
                {TYPOGRAPHY_SIZE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
