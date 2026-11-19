import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TutoCard from "@/components/TutoCard";
import { PERSONAS } from "@/lib/content";
import { THEME_LABELS, getTutorials } from "@/lib/mexty";

export const metadata: Metadata = {
  title: "Tous les tutos",
  description: "Tous les tutos gratuits de fabien.ninja : Mexty, EdVerse et l'IA, pour les learning designers, les profs, les parents et les créateurs.",
  alternates: { canonical: "/tutos" },
};

type Search = { q?: string; pour?: string; theme?: string };

function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default async function TutosPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { q = "", pour = "", theme = "" } = await searchParams;
  const all = await getTutorials();
  const query = norm(q.trim());
  const list = all.filter((t) => {
    if (pour && !t.tags?.includes(`pour-${pour}`)) return false;
    if (theme && !t.tags?.includes(`theme-${theme}`)) return false;
    if (!query) return true;
    return norm(`${t.title} ${t.excerpt || ""} ${(t.tags || []).join(" ")}`).includes(query);
  });

  const chip = (label: string, params: Search, on: boolean) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    const qs = sp.toString();
    return (
      <Link key={label} href={qs ? `/tutos?${qs}` : "/tutos"} className={on ? "chip on" : "chip"} aria-current={on ? "true" : undefined}>
        {label}
      </Link>
    );
  };

  return (
    <>
      <SiteHeader q={q} />
      <main id="contenu" className="wrap" style={{ paddingTop: 64, paddingBottom: 96, display: "flex", flexDirection: "column", gap: 24 }}>
        <span className="eyebrow">Tous les tutos</span>
        <h1 className="disp disp-xl" style={{ margin: 0, fontSize: 52, lineHeight: 1.05 }}>Choisis ton tuto</h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {chip("Tous", { theme }, !pour)}
          {PERSONAS.map((p) => {
            const key = p.key.replace("pour-", "");
            return chip(p.name, { pour: key, theme }, pour === key);
          })}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {chip("Tous les thèmes", { pour }, !theme)}
          {Object.entries(THEME_LABELS).map(([tag, label]) => {
            const key = tag.replace("theme-", "");
            return chip(label, { pour, theme: key }, theme === key);
          })}
        </div>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }} aria-live="polite">
          {list.length} tuto{list.length > 1 ? "s" : ""}{q ? ` pour « ${q} »` : ""}
        </p>
        {list.length ? (
          <div className="tlist">
            {list.map((t) => <TutoCard key={t._id || t.slug} t={t} />)}
          </div>
        ) : (
          <div className="panel" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
            <strong className="disp" style={{ fontSize: 22 }}>{all.length ? "Aucun tuto ne correspond." : "Les premiers tutos arrivent."}</strong>
            <span style={{ color: "var(--muted)" }}>
              {all.length ? "Essaie un autre mot ou retire un filtre." : "Ils sont en cours d'écriture. Reviens bientôt, ou commence par Mexty en attendant."}
            </span>
            <Link href={all.length ? "/tutos" : "https://mexty.ai"} className="btn y">{all.length ? "Voir tous les tutos" : "Découvrir Mexty"}</Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
