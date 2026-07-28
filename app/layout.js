import "./globals.css";
import { getContent } from "@/lib/db";
import { buildThemeVars, googleFontsHref } from "@/lib/theme";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const content = getContent();
  return {
    title: content.pages.inicio.seo.title,
    description: content.pages.inicio.seo.description,
  };
}

export default function RootLayout({ children }) {
  const content = getContent();
  const { settings } = content;

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href={googleFontsHref(settings.fonts)} rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: buildThemeVars(settings) }} />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
