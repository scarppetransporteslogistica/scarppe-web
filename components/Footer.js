import Link from "next/link";

export default function Footer({ menu, siteName, logo }) {
  return (
    <footer style={{ background: "#0d1020" }} className="border-t border-white/10">
      <div className="max-w-container mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div className="grid gap-10 md:grid-cols-4 pb-10 border-b border-white/10">
          <div className="md:col-span-2">
            {logo ? (
              <img src={logo} alt={siteName} className="h-14 w-auto mb-5" />
            ) : (
              <p className="font-heading text-lg font-bold text-white uppercase mb-5">{siteName}</p>
            )}
            <p className="font-body text-sm text-light max-w-xs leading-relaxed">
              Empresa de transporte y logística con flota propia, más de 80 años de trayectoria en Uruguay y Brasil.
            </p>
          </div>
          <div>
            <p className="font-heading text-xs font-bold text-accent uppercase tracking-[0.2em] mb-5">Navegación</p>
            <ul className="space-y-2.5 font-body text-sm">
              {menu.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-light hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-heading text-xs font-bold text-accent uppercase tracking-[0.2em] mb-5">Contacto</p>
            <ul className="space-y-2.5 font-body text-sm text-light">
              <li>Uruguay · Brasil</li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Solicitar cotización
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs tracking-wide text-light font-body">
            © {new Date().getFullYear()} {siteName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
