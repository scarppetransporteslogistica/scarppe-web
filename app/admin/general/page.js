"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField, AdminColor } from "@/components/admin/AdminField";
import AdminImageUpload from "@/components/admin/AdminImageUpload";
import SaveBar from "@/components/admin/SaveBar";
import { GOOGLE_FONT_OPTIONS, TYPOGRAPHY_WEIGHT_OPTIONS, LOGO_SIZE_OPTIONS } from "@/lib/theme";

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
          <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">Tamaño del logo (encabezado y pie de página)</label>
          <select
            value={s.logoScale || "1"}
            onChange={(e) => updateSettings({ logoScale: e.target.value })}
            className="w-full sm:w-64 rounded-lg border border-black/10 px-4 py-2.5 font-body text-sm"
          >
            {LOGO_SIZE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <p className="font-body text-sm font-semibold text-primary mb-3">Paleta de colores</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <AdminColor label="Color primario (navy)" value={s.colors.primary} onChange={(v) => updateSettings({ colors: { ...s.colors, primary: v } })} />
            <AdminColor label="Color secundario" value={s.colors.secondary} onChange={(v) => updateSettings({ colors: { ...s.colors, secondary: v } })} />
            <AdminColor label="Color terciario" value={s.colors.tertiary} onChange={(v) => updateSettings({ colors: { ...s.colors, tertiary: v } })} />
            <AdminColor label="Color de acento" value={s.colors.accent} onChange={(v) => updateSettings({ colors: { ...s.colors, accent: v } })} />
            <AdminColor label="Color claro (fondos)" value={s.colors.light} onChange={(v) => updateSettings({ colors: { ...s.colors, light: v } })} />
            <AdminColor label="Color del número en tarjetas de servicio" value={s.colors.serviceNumber || "#193F73"} onChange={(v) => updateSettings({ colors: { ...s.colors, serviceNumber: v } })} />
          </div>
        </div>

        <div>
          <p className="font-body text-sm font-semibold text-primary mb-3">Color del texto</p>
          <p className="font-body text-xs text-primary/50 mb-3">
            El sitio tiene secciones con fondo claro (texto oscuro) y secciones con fondo oscuro/navy (texto blanco). Podés elegir un color para cada una por separado. Si no tocás nada, queda como está.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminColor label="Texto en fondos claros" value={s.colors.textLight || s.colors.primary} onChange={(v) => updateSettings({ colors: { ...s.colors, textLight: v } })} />
            <AdminColor label="Texto en fondos oscuros" value={s.colors.textDark || "#FFFFFF"} onChange={(v) => updateSettings({ colors: { ...s.colors, textDark: v } })} />
          </div>
        </div>

        <div>
          <p className="font-body text-sm font-semibold text-primary mb-3">Tipografía de títulos</p>
          <p className="font-body text-xs text-primary/50 mb-3">
            Esto es la base general del sitio: se aplica a todos los títulos que no tengan su propio ajuste. Si en un título puntual usaste el cuadro "Formato" de esa sección para cambiar su tamaño, fuente o color, ese ajuste individual manda por sobre esto.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">Tamaño (%)</label>
              <input
                type="number"
                min="50"
                max="250"
                step="5"
                value={typo.headingSizePercent || 100}
                onChange={(e) => updateTypography({ headingSizePercent: e.target.value })}
                className="w-full rounded-lg border border-black/10 px-4 py-2.5 font-body text-sm"
              />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">Interlineado (%)</label>
              <input
                type="number"
                min="50"
                max="200"
                step="5"
                value={typo.headingLineHeightPercent || 100}
                onChange={(e) => updateTypography({ headingLineHeightPercent: e.target.value })}
                className="w-full rounded-lg border border-black/10 px-4 py-2.5 font-body text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="font-body text-sm font-semibold text-primary mb-3">Tipografía de texto</p>
          <p className="font-body text-xs text-primary/50 mb-3">
            Base general para párrafos de todo el sitio. Los cuadros "Formato" de cada párrafo individual, si están configurados, tienen prioridad sobre esto.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">Tamaño (%)</label>
              <input
                type="number"
                min="50"
                max="250"
                step="5"
                value={typo.bodySizePercent || 100}
                onChange={(e) => updateTypography({ bodySizePercent: e.target.value })}
                className="w-full rounded-lg border border-black/10 px-4 py-2.5 font-body text-sm"
              />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">Interlineado (%)</label>
              <input
                type="number"
                min="50"
                max="200"
                step="5"
                value={typo.bodyLineHeightPercent || 100}
                onChange={(e) => updateTypography({ bodyLineHeightPercent: e.target.value })}
                className="w-full rounded-lg border border-black/10 px-4 py-2.5 font-body text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
