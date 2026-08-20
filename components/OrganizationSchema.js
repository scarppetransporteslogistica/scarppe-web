import { SITE_URL, defaultImage } from "@/lib/seo";

// JSON-LD structured data (schema.org), rendered once site-wide in the root
// layout. This is what lets Google show richer results — business name,
// phone, address — instead of just a plain blue link, and is one of the
// signals used for local search ("transporte de cargas cerca de mí", etc.).
// It's invisible to visitors; only search engines read it.
export default function OrganizationSchema({ content }) {
  const { settings, pages } = content;
  const contacto = pages.contacto || {};
  const telefono = (contacto.contactosTelefono && contacto.contactosTelefono[0]?.telefono) || contacto.gerencia || "";
  const image = defaultImage(content);
  const logo = settings.logo
    ? settings.logo.startsWith("http")
      ? settings.logo
      : `${SITE_URL}${settings.logo}`
    : image;

  const addresses = (contacto.mapas || []).map((m) => ({
    "@type": "PostalAddress",
    streetAddress: m.direccion,
    addressCountry: m.pais === "Brasil" ? "BR" : "UY",
  }));

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.siteName || "Scarppe Transporte y Logística",
    url: SITE_URL,
    ...(image ? { image } : {}),
    ...(logo ? { logo } : {}),
    ...(telefono ? { telephone: telefono } : {}),
    ...(addresses.length ? { address: addresses.length === 1 ? addresses[0] : addresses } : {}),
    areaServed: ["Uruguay", "Brasil"],
    description: pages.inicio?.seo?.description || undefined,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
