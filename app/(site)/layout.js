import { getContent } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function SiteLayout({ children }) {
  const content = getContent();
  const { settings, menu, servicios } = content;

  return (
    <>
      <Header
        menu={menu}
        logo={settings.logo}
        siteName={settings.siteName}
        servicios={servicios}
        headerCta={settings.headerCta}
        headerCtaBox={settings.headerCtaBox}
        menuGapDesktop={settings.menuGapDesktop}
        menuGapMobile={settings.menuGapMobile}
      />
      <main>{children}</main>
      <Footer menu={menu} siteName={settings.siteName} logo={settings.logo} />
    </>
  );
}
