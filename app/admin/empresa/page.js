"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField, AdminTextarea } from "@/components/admin/AdminField";
import AdminGalleryManager from "@/components/admin/AdminGalleryManager";
import AdminImageUpload from "@/components/admin/AdminImageUpload";
import ImageFocalControls from "@/components/admin/ImageFocalControls";
import TextFormatControls from "@/components/admin/TextFormatControls";
import BoxFormatControls from "@/components/admin/BoxFormatControls";
import SaveBar from "@/components/admin/SaveBar";
import { POLITICA_GESTION_DEFAULTS } from "@/lib/politicaGestionDefaults";

export default function AdminEmpresaPage() {
  const { content, setContent, save, saving, message, loading } = useAdmin();
  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  const e = content.pages.empresa;
  const fmt = e.formats || {};
  const pg = e.politicaGestion || {};
  const principios = pg.principios && pg.principios.length ? pg.principios : POLITICA_GESTION_DEFAULTS.principios;
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
  function updatePolitica(patch) {
    updateEmpresa({ politicaGestion: { ...pg, ...patch } });
  }
  function updatePrincipio(i, value) {
    const next = principios.map((p, idx) => (idx === i ? value : p));
    updatePolitica({ principios: next });
  }
  function updatePrincipioFormat(i, key, value) {
    const pfmts = pg.principiosFormats || [];
    const cur = pfmts[i] || {};
    const nextFmts = principios.map((_, idx) => (idx === i ? { ...cur, [key]: value } : pfmts[idx] || {}));
    updatePolitica({ principios, principiosFormats: nextFmts });
  }
  function addPrincipio() {
    updatePolitica({ principios: [...principios, "Nuevo principio"] });
  }
  function removePrincipio(i) {
    const pfmts = pg.principiosFormats || [];
    updatePolitica({
      principios: principios.filter((_, idx) => idx !== i),
      principiosFormats: pfmts.filter((_, idx) => idx !== i),
    });
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
        <div className="pt-2 border-t border-black/5 space-y-2">
          <AdminImageUpload label="Imagen de fondo (opcional)" value={e.heroImagen || ""} onChange={(v) => updateEmpresa({ heroImagen: v })} />
          <p className="font-body text-xs text-primary/50">
            Si subís una foto, se muestra de fondo en esta franja con un degradado oscuro encima para que el título siga leyéndose bien. Si no subís nada, queda el fondo de color liso de siempre.
          </p>
          {e.heroImagen && (
            <ImageFocalControls label="Encuadre de la imagen de fondo" value={fmt.heroImagenFoco} onChange={(v) => updateFormat("heroImagenFoco", v)} />
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <p className="font-body text-sm font-semibold text-primary">Historia (aparece primero en la página, texto y fotos en dos columnas)</p>
        <AdminField label="Subtítulo de la sección" value={e.historia.titulo} onChange={(v) => updateEmpresa({ historia: { ...e.historia, titulo: v } })} />
        <TextFormatControls label="Formato: subtítulo de la sección" value={fmt.historiaTitulo} onChange={(v) => updateFormat("historiaTitulo", v)} showFirstLine={false} />
        <AdminTextarea label="Texto" rows={8} value={e.historia.texto} onChange={(v) => updateEmpresa({ historia: { ...e.historia, texto: v } })} />
        <TextFormatControls label="Formato: texto de la historia" value={fmt.historiaTexto} onChange={(v) => updateFormat("historiaTexto", v)} />
        <AdminGalleryManager
          label="Fotos de historia (rotan automáticamente, en un cuadro fijo junto al texto)"
          helpText='Por defecto cada foto se ve completa, sin recortar ni deformar. Si alguna queda muy chica dentro del cuadro o preferís encuadrarla vos mismo/a, usá "Zoom / encuadre" en esa foto para acercarla y ubicarla como quieras.'
          value={e.historia.gallery || []}
          onChange={(v) => updateEmpresa({ historia: { ...e.historia, gallery: v } })}
          formats={e.historia.galleryFormats || []}
          enableZoom
          onChangeWithFormats={(images, galleryFormats) => updateEmpresa({ historia: { ...e.historia, gallery: images, galleryFormats } })}
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
        <BoxFormatControls label="Tamaño del cuadro de Misión" value={fmt.misionBox} onChange={(v) => updateFormat("misionBox", v)} />
        <AdminTextarea label="Visión" rows={4} value={e.vision} onChange={(v) => updateEmpresa({ vision: v })} />
        <TextFormatControls label="Formato: texto de Visión" value={fmt.visionTexto} onChange={(v) => updateFormat("visionTexto", v)} />
        <BoxFormatControls label="Tamaño del cuadro de Visión" value={fmt.visionBox} onChange={(v) => updateFormat("visionBox", v)} />
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
                <TextFormatControls label={`Formato: nombre del valor ${i + 1}`} value={vfmt.nombre} onChange={(val) => updateValorFormat(i, "nombre", val)} showFirstLine={false} previewText={v.nombre} />
              </div>
              <div className="space-y-2">
                <AdminTextarea label="Descripción" rows={2} value={v.descripcion} onChange={(val) => updateValor(i, { descripcion: val })} />
                <TextFormatControls label={`Formato: descripción del valor ${i + 1}`} value={vfmt.descripcion} onChange={(val) => updateValorFormat(i, "descripcion", val)} previewText={v.descripcion} />
                <BoxFormatControls label="Tamaño de la tarjeta" value={vfmt.box} onChange={(val) => updateValorFormat(i, "box", val)} />
                <button onClick={() => removeValor(i)} className="text-xs font-body text-red-600 hover:underline mt-2">Eliminar valor</button>
              </div>
            </div>
          );
        })}
        <button onClick={addValor} className="text-sm font-body text-tertiary hover:underline">+ Agregar valor</button>
      </section>

      <section className="mt-6 bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <p className="font-body text-sm font-semibold text-primary">Política de Gestión (aparece debajo de "Nuestros Valores")</p>

        <div>
          <AdminField label="Título" value={pg.titulo || ""} onChange={(v) => updatePolitica({ titulo: v })} />
          <p className="font-body text-xs text-primary/45 mt-1">Vacío = "{POLITICA_GESTION_DEFAULTS.titulo}"</p>
          <TextFormatControls label="Formato: título" value={fmt.politicaTitulo} onChange={(v) => updateFormat("politicaTitulo", v)} showFirstLine={false} />
        </div>

        <div>
          <AdminTextarea label="Texto introductorio" rows={4} value={pg.intro ?? POLITICA_GESTION_DEFAULTS.intro} onChange={(v) => updatePolitica({ intro: v })} />
          <TextFormatControls label="Formato: texto introductorio" value={fmt.politicaIntro} onChange={(v) => updateFormat("politicaIntro", v)} />
        </div>

        <div>
          <AdminField
            label='Subtítulo antes de la lista (por defecto: "Nuestra política de gestión se basa en los siguientes principios:")'
            value={pg.principiosTitulo ?? POLITICA_GESTION_DEFAULTS.principiosTitulo}
            onChange={(v) => updatePolitica({ principiosTitulo: v })}
          />
          <TextFormatControls label="Formato: subtítulo antes de la lista" value={fmt.politicaPrincipiosTitulo} onChange={(v) => updateFormat("politicaPrincipiosTitulo", v)} showFirstLine={false} />
        </div>

        <div className="space-y-3">
          <p className="font-body text-sm font-semibold text-primary">Principios (lista con viñetas)</p>
          {principios.map((p, i) => {
            const pfmt = (pg.principiosFormats || [])[i] || {};
            return (
              <div key={i} className="border border-black/10 rounded-xl p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <AdminTextarea label={`Principio ${i + 1}`} rows={2} value={p} onChange={(v) => updatePrincipio(i, v)} />
                  </div>
                  <button onClick={() => removePrincipio(i)} className="h-9 w-9 rounded-full border border-red-200 text-red-600 hover:bg-red-50 shrink-0 mt-6">✕</button>
                </div>
                <TextFormatControls
                  label={`Formato: principio ${i + 1}`}
                  value={pfmt.text}
                  onChange={(v) => updatePrincipioFormat(i, "text", v)}
                  showFirstLine={false}
                  previewText={p}
                />
              </div>
            );
          })}
          <button onClick={addPrincipio} className="text-sm font-body text-tertiary hover:underline">+ Agregar principio</button>
        </div>

        <div>
          <AdminTextarea label="Texto de cierre" rows={4} value={pg.cierre ?? POLITICA_GESTION_DEFAULTS.cierre} onChange={(v) => updatePolitica({ cierre: v })} />
          <TextFormatControls label="Formato: texto de cierre" value={fmt.politicaCierre} onChange={(v) => updateFormat("politicaCierre", v)} />
        </div>
      </section>

      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
