import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="contenu" className="wrap" style={{ paddingTop: 96, paddingBottom: 96, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
        <span className="eyebrow">404</span>
        <h1 className="disp disp-xl" style={{ margin: 0, fontSize: 48 }}>Ce tuto n&apos;existe pas (encore).</h1>
        <p style={{ margin: 0, color: "var(--soft)" }}>Il a peut-être changé d&apos;adresse. Les autres t&apos;attendent.</p>
        <Link href="/tutos" className="btn y">Tous les tutos</Link>
      </main>
      <SiteFooter />
    </>
  );
}
