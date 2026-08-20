import "./globals.css";
import { getContent } from "@/lib/db";
import { buildThemeVars, googleFontsHref, typographyBodyClasses, collectFontFamilies } from "@/lib/theme";
import { pageMetadata } from "@/lib/seo";
import OrganizationSchema from "@/components/OrganizationSchema";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const content = getContent();
  return pageMetadata(content, {
    title: content.pages.inicio.seo.title,
    description: content.pages.inicio.seo.description,
    path: "/",
  });
}

export default function RootLayout({ children }) {
  const content = getContent();
  const { settings } = content;
  const extraFamilies = Array.from(collectFontFamilies(content));

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href={googleFontsHref(settings.fonts, extraFamilies)} rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: buildThemeVars(settings) }} />
      </head>
      <body className={`font-body antialiased ${typographyBodyClasses(settings)}`}>
        <OrganizationSchema content={content} />
        {children}
      </body>
    </html>
  );
}
