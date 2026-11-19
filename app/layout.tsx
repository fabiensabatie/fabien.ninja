import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "fabien.ninja · Tutos Mexty, EdVerse et IA", template: "%s · fabien.ninja" },
  description: SITE_DESCRIPTION,
  openGraph: { type: "website", siteName: SITE_NAME, locale: "fr_FR", url: SITE_URL },
};

export const viewport: Viewport = { themeColor: "#120F2B" };

// Applied before paint so a visitor who picked the light theme never sees a
// dark flash. Same key as the design prototype.
const THEME_SCRIPT = `try{if(localStorage.getItem("fn-theme")==="light")document.documentElement.classList.add("light")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700;800&family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap"
        />
      </head>
      <body>
        <a className="skip" href="#contenu">Aller au contenu</a>
        <div className="page">{children}</div>
      </body>
    </html>
  );
}
