"use client";
import { useState } from "react";
import Link from "next/link";
import SearchModal from "./SearchModal";

export default function Header({ menu, logo, siteName, servicios }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-primary shadow-[0_2px_24px_rgba(0,0,0,0.25)]">
        <div className="max-w-container mx-auto px-6 lg:px-10 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {logo ? (
              <img src={logo} alt={siteName} className="h-14 md:h-16 w-auto" />
            ) : (
              <span className="font-heading text-xl font-bold text-white uppercase tracking-wide">{siteName}</span>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-white/75 hover:text-white hover:bg-white/[0.08] transition-colors px-3.5 py-2 rounded-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              aria-label="Buscar"
              onClick={() => setSearchOpen(true)}
              className="h-10 w-10 rounded-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <Link
              href="/contacto"
              className="hidden md:inline-flex items-center rounded-sm bg-accent text-primary font-heading text-xs font-bold uppercase tracking-[0.15em] px-5 py-2.5 hover:brightness-95 transition-all"
            >
              Solicitar Cotización
            </Link>
            <button
              className="lg:hidden h-10 w-10 flex items-center justify-center text-white"
              onClick={() => setOpen(!open)}
              aria-label="Menú"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-1">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-heading text-sm font-semibold uppercase tracking-wide text-white/80 py-2"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contacto"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-sm bg-accent text-primary font-heading text-xs font-bold uppercase tracking-[0.15em] px-5 py-3 mt-2"
            >
              Solicitar Cotización
            </Link>
          </nav>
        )}
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} servicios={servicios} />
    </header>
  );
}
