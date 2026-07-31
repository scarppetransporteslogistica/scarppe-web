"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminProvider } from "@/lib/AdminContext";

const NAV = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/preview", label: "Vista previa responsive" },
  { href: "/admin/general", label: "General (logo, colores, tipografías)" },
  { href: "/admin/menu", label: "Menú" },
  { href: "/admin/inicio", label: "Inicio (banners)" },
  { href: "/admin/empresa", label: "Empresa" },
  { href: "/admin/servicios", label: "Servicios" },
  { href: "/admin/comercio-exterior", label: "Comercio Exterior" },
  { href: "/admin/contacto", label: "Contacto" },
  { href: "/admin/trabaja-con-nosotros", label: "Trabaja con Nosotros" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/formularios", label: "Formularios" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <div className="min-h-screen">{children}</div>;
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <AdminProvider>
      <div className="min-h-screen flex bg-black/[0.02]">
        <aside className="w-72 shrink-0 bg-primary text-white flex flex-col">
          <div className="px-6 py-6 border-b border-white/10">
            <p className="font-heading font-bold text-lg">Panel Scarppe</p>
            <p className="font-body text-xs text-white/50 mt-1">Administración del sitio</p>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-6 py-2.5 font-body text-sm transition-colors ${
                  pathname === item.href ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link href="/" target="_blank" className="block text-center text-xs font-body text-white/60 hover:text-white">
              Ver sitio en vivo ↗
            </Link>
            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center rounded-full border border-white/20 text-white text-xs font-semibold px-4 py-2 hover:bg-white/10 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>
        <main className="flex-1 px-8 py-10 max-w-4xl">{children}</main>
      </div>
    </AdminProvider>
  );
}
