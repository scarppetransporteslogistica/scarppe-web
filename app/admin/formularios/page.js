"use client";
import { useAdmin } from "@/lib/AdminContext";
import { AdminField } from "@/components/admin/AdminField";
import SaveBar from "@/components/admin/SaveBar";

export default function AdminFormulariosPage() {
  const { content, setContent, save, saving, message, loading } = useAdmin();
  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  const s = content.settings;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Formularios</h1>
      <div className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <AdminField
          label="Access Key de Web3Forms"
          value={s.web3formsKey}
          onChange={(v) => setContent({ ...content, settings: { ...s, web3formsKey: v } })}
          placeholder="Pegá acá tu access key gratuita de web3forms.com"
        />
        <p className="font-body text-xs text-primary/50 leading-relaxed">
          Los formularios de Cotización y Trabaja con Nosotros no envían e-mails reales hasta que completes este
          campo. Creá una cuenta gratuita en web3forms.com, copiá tu access key y pegala acá. El e-mail de destino de
          cada formulario se define en las secciones Contacto y Trabaja con Nosotros.
        </p>
      </div>
      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
