// Shared SEO helpers used across every public page's generateMetadata().
//
// SITE_URL: same pattern as the CV email link fix — a fixed constant
// instead of trying to detect it from the incoming request, since that
// resolved to "localhost" in production on this host. Override with the
// SITE_URL env var in Render if the domain ever changes again.
export const SITE_URL = (process.env.SITE_URL || "https://scarppe.com.uy").replace(/\/$/, "");

function absoluteImage(src) {
  if (!src) return null;
  return src.startsWith("http") ? src : `${SITE_URL}${src}`;
}

// Best available "default" image for a page that has no photo of its own
// (Contacto, Trabaja con Nosotros): the site's hero banner photo, falling
// back to the logo if even that's missing.
export function defaultImage(content) {
  const inicio = content?.pages?.inicio || {};
  const hero = (inicio.heroImages && inicio.heroImages[0]) || inicio.heroImage;
  return absoluteImage(hero || content?.settings?.logo);
}

// Builds the full metadata object (title, description, canonical URL, Open
// Graph, Twitter card) for a single page. `path` is the page's route
// (e.g. "/empresa"); `image` is optional, defaults to defaultImage(content).
export function pageMetadata(content, { title, description, path = "/", image }) {
  const url = `${SITE_URL}${path}`;
  const ogImage = absoluteImage(image) || defaultImage(content);
  const siteName = content?.settings?.siteName || "Scarppe Transporte y Logística";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: "es_UY",
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
