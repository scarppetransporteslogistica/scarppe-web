"use client";
import { useState } from "react";
import Link from "next/link";
import SearchModal from "./SearchModal";
import TextFormatStyle from "./TextFormatStyle";
import BoxFormatStyle, { bfClass } from "./BoxFormatStyle";
import SectionTypographyStyle from "./SectionTypographyStyle";

export default function Header({ menu, logo, siteName, servicios, headerCta, headerCtaBox, menuGapDesktop, menuGapMobile, sectionTypography }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 sec-typo-menu">
      <SectionTypographyStyle className="sec-typo-menu" format={sectionTypography} />
      <div className="bg-primary shadow-[0_2px_24px_rgba(0,0,0,0.25)]">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-10 h-16 tablet:h-20 desktop:h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            {logo ? (
              <img src={logo} alt={siteName} className="site-logo-header w-auto" />
            ) : (
              <span className="font-heading text-lg sm:text-xl font-bold text-white uppercase tracking-wide truncate">{siteName}</span>
            )}
          </Link>

          <nav className="hidden desktop:flex items-center gap-1 shrink-0" style={menuGapDesktop ? { gap: `${menuGapDesktop}px` } : undefined}>
            {menu.map((item, i) => (
              <span key={item.href}>
                <TextFormatStyle id={`menu-item-${i}`} format={item.formats} sizeCategory="label-xxs" />
                <Link
                  href={item.href}
                  className={`tf-menu-item-${i} font-heading text-[11px] font-semibold uppercase tracking-[0.1em] text-white/75 hover:text-white hover:bg-white/[0.08] transition-colors px-2.5 py-2 rounded-sm whitespace-nowrap`}
                >
                  {item.label}
                </Link>
              </span>
            ))}
            <TextFormatStyle id="menu-cta" format={headerCta} sizeCategory="label-xxs" />
            <BoxFormatStyle id="menu-cta" format={headerCtaBox} />
            <Link
              href="/contacto"
              className={`tf-menu-cta ${bfClass("menu-cta")} font-heading text-[11px] font-bold uppercase tracking-[0.1em] text-primary bg-accent hover:brightness-90 transition-all px-3.5 py-2 rounded-sm whitespace-nowrap ml-2`}
            >
              Solicitar Cotización
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              aria-label="Buscar"
              onClick={() => setSearchOpen(true)}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors shrink-0"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button
              className="desktop:hidden h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center text-white shrink-0"
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
          <nav className="desktop:hidden border-t border-white/10 px-4 sm:px-6 py-4 flex flex-col gap-1" style={menuGapMobile ? { gap: `${menuGapMobile}px` } : undefined}>
            {menu.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`tf-menu-item-${i} font-heading text-sm font-semibold uppercase tracking-wide text-white/80 py-2`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contacto"
              onClick={() => setOpen(false)}
              className={`tf-menu-cta ${bfClass("menu-cta")} btn-cta inline-flex items-center justify-center rounded-sm bg-accent text-primary font-heading font-bold uppercase tracking-[0.15em] px-5 py-3.5 mt-2`}
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
