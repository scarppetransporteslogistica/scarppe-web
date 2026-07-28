"use client";
import Link from "next/link";
import { useAdmin } from "@/lib/AdminContext";

export default function AdminDashboard() {
  const { content, loading } = useAdmin();

  if (loading || !content) return <p className="font-body text-primary/60">Cargando...</p>;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary mb-2">Bienvenida, editá tu sitio sin tocar código</h1>
      <p className="font-body text-sm text-primary/60 mb-8">
        Usá el menú de la izquierda para editar cada sección. Los cambios se publican al instante al guardar.
      </p>
      <div className="grid sm:grid-cols-2 gap-5">
        <SummaryCard label="Servicios publicados" value={content.servicios.length} />
        <SummaryCard label="Ítems del menú" value={content.menu.length} />
        <SummaryCard label="Directores" value={content.pages.contacto.directores.length} />
        <SummaryCard label="Oficinas / mapas" value={content.pages.contacto.mapas.length} />
      </div>
      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6">
        <p className="font-heading font-semibold text-primary mb-2">Atajos</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/general" className="text-sm font-body text-tertiary hover:underline">Cambiar logo y colores</Link>
          <Link href="/admin/inicio" className="text-sm font-body text-tertiary hover:underline">Editar banner del inicio</Link>
          <Link href="/admin/servicios" className="text-sm font-body text-tertiary hover:underline">Agregar un servicio</Link>
          <Link href="/admin/formularios" className="text-sm font-body text-tertiary hover:underline">Conectar formularios</Link>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6">
      <p className="font-heading text-3xl font-bold text-primary">{value}</p>
      <p className="font-body text-sm text-primary/60 mt-1">{label}</p>
    </div>
  );
}
