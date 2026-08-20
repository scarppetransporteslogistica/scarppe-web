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

      <div className="bg-white rounded-2xl border border-black/5 p-6 space-y-3 mb-6">
        <p className="font-body text-sm text-primary/70 leading-relaxed">
          Cada formulario necesita su propia cuenta gratuita en <strong>web3forms.com</strong>, creada con el e-mail al
          que querés que lleguen esos avisos (no todas pueden compartir la misma cuenta, porque el correo siempre
          llega a la casilla con la que se creó la cuenta, sin importar qué e-mail tengas cargado en Contacto o
          Trabaja con Nosotros). Creá una cuenta por cada destino que necesites, copiá el access key de cada una y
          pegalo en su campo correspondiente acá abajo.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-6 space-y-4 mb-6">
        <p className="font-body text-sm font-semibold text-primary">Formulario de Cotización</p>
        <AdminField
          label="Access Key de Web3Forms (cuenta creada con el e-mail de Contacto)"
          value={s.web3formsKeyCotizacion}
          onChange={(v) => setContent({ ...content, settings: { ...s, web3formsKeyCotizacion: v } })}
          placeholder="Pegá acá el access key de la cuenta que recibe las cotizaciones"
        />
        <p className="font-body text-xs text-primary/50">
          Tiene que ser el access key de una cuenta de web3forms.com creada con el mismo e-mail que pusiste en
          Contacto → "E-mail para recibir cotizaciones".
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <p className="font-body text-sm font-semibold text-primary">Formulario de Trabaja con Nosotros (CV)</p>
        <AdminField
          label="Access Key de Web3Forms (cuenta creada con el e-mail que recibe los CV)"
          value={s.web3formsKeyTrabajo}
          onChange={(v) => setContent({ ...content, settings: { ...s, web3formsKeyTrabajo: v } })}
          placeholder="Pegá acá el access key de la cuenta que recibe los CV"
        />
        <p className="font-body text-xs text-primary/50">
          Tiene que ser el access key de otra cuenta de web3forms.com (distinta a la de arriba), creada con el mismo
          e-mail que pusiste en Trabaja con Nosotros → "E-mail para recibir CV". El correo con el CV incluye un link
          para abrir/descargar el PDF (no va adjunto directamente, eso es una función paga de Web3Forms).
        </p>
      </div>

      <SaveBar onSave={() => save()} saving={saving} message={message} />
    </div>
  );
}
