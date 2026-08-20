import { getContent } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

// Dynamic sitemap: every static page, plus one entry per servicio (so a new
// service added in the admin panel is picked up automatically next time
// this is regenerated — no manual list to keep in sync).
export const dynamic = "force-dynamic";

export default function sitemap() {
  const { servicios } = getContent();
  const now = new Date();

  const staticPages = [
    { path: "/", priority: 1 },
    { path: "/empresa", priority: 0.7 },
    { path: "/servicios", priority: 0.9 },
    { path: "/comercio-exterior", priority: 0.7 },
    { path: "/contacto", priority: 0.8 },
    { path: "/trabaja-con-nosotros", priority: 0.5 },
  ].map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p.priority,
  }));

  const servicioPages = (servicios || []).map((s) => ({
    url: `${SITE_URL}/servicios/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...servicioPages];
}
