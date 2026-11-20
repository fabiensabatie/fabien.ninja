import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import OnAir from "@/components/OnAir";
import { fmtDuration, getRadio } from "@/lib/radio";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Radio Monkey",
  description: "Radio Monkey, la radio des sessions Ride Studio : tous les morceaux passés à l'antenne, à réécouter.",
  alternates: { canonical: "/radio" },
};

const fmtDate = (ts?: number) =>
  ts ? new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";

export default async function RadioPage() {
  const radio = await getRadio();
  const { tracks } = radio;
  return (
    <>
      <SiteHeader />
      <main id="contenu" className="wrap" style={{ paddingTop: 64, paddingBottom: 96, display: "flex", flexDirection: "column", gap: 24 }}>
        <span className="eyebrow">Ride Studio</span>
        <h1 className="disp disp-xl" style={{ margin: 0, fontSize: 56, lineHeight: 1.02, fontWeight: 800 }}>
          Radio <span className="grad">Monkey</span>
        </h1>
        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: "var(--soft)", maxWidth: 620 }}>
          La radio qui tourne pendant les sessions Ride Studio, quand je construis une formation sur la route. Voici tous les morceaux passés à l&apos;antenne.
        </p>
        <OnAir initial={radio.live} />

        <section aria-labelledby="titres" style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
            <h2 id="titres" className="disp" style={{ margin: 0, fontSize: 30 }}>Déjà diffusés</h2>
            <span style={{ fontSize: 14, color: "var(--muted)" }}>{tracks.length} morceau{tracks.length > 1 ? "x" : ""}</span>
          </div>
          {tracks.length ? (
            <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {tracks.map((t, i) => (
                <li key={t.id} className="panel radio-row">
                  <span className="disp" style={{ fontSize: 20, color: "var(--acc)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                    <strong style={{ fontSize: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</strong>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>
                      {[t.artist, fmtDuration(t.durationSec), t.lastPlayedAt ? `diffusé le ${fmtDate(t.lastPlayedAt)}` : null].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <audio controls preload="none" src={t.url} style={{ width: "100%" }} aria-label={`Écouter ${t.title}`} />
                </li>
              ))}
            </ol>
          ) : (
            <div className="panel" style={{ padding: 28, color: "var(--muted)" }}>
              Rien n&apos;est encore passé à l&apos;antenne. Le premier morceau arrive avec la prochaine session.
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
