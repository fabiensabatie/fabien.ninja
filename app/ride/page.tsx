import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { fmtClock, fmtDay, getSessions, KIND } from "@/lib/ride";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ride Studio Sessions",
  description: "Les sessions Ride Studio : une formation construite sur la route, à la voix, avec Claude. La vidéo, la formation livrée en accès libre et le transcript.",
  alternates: { canonical: "/ride" },
};

export default async function RidePage() {
  const sessions = await getSessions();
  return (
    <>
      <SiteHeader />
      <main id="contenu" className="wrap" style={{ paddingTop: 64, paddingBottom: 96, display: "flex", flexDirection: "column", gap: 24 }}>
        <span className="eyebrow">Ride Studio</span>
        <h1 className="disp disp-xl" style={{ margin: 0, fontSize: 56, lineHeight: 1.02, fontWeight: 800 }}>
          Ride Studio <span className="grad">Sessions</span>
        </h1>
        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: "var(--soft)", maxWidth: 640 }}>
          Sur la route, je construis une formation à la voix avec Claude, qui la fabrique en direct sur Mexty. À l&apos;arrivée, elle est livrée et ouverte à tous, gratuitement. Voici chaque session : la vidéo, la formation et tout ce qui s&apos;est dit.
        </p>

        {sessions.length ? (
          <div className="ride-grid">
            {sessions.map((s) => (
              <Link key={s.no} href={`/ride/${s.no}`} className="rsc">
                <span className="th" style={s.thumb ? { backgroundImage: `url(${s.thumb})` } : undefined}>
                  <span className="pl" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z" fill="currentColor" /></svg></span>
                  <span className="num">{String(s.no).padStart(2, "0")}</span>
                  <span className="dur">{fmtClock(s.durationSec)}</span>
                </span>
                <span className="rsm" style={{ color: "var(--acc)" }}>Session {s.no}{s.company && s.company !== s.title ? ` · ${s.company}` : ""}</span>
                <span style={{ fontWeight: 700, fontSize: 17, lineHeight: 1.3 }}>{s.title}</span>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>
                  {[fmtDay(s.endedAt), s.delivered.length ? s.delivered.map((d) => KIND[d.kind] ?? "Contenu").join(", ") : null, s.videos.length ? null : "vidéo en route"].filter(Boolean).join(" · ")}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="panel" style={{ padding: 28, color: "var(--muted)" }}>La première session arrive bientôt.</div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
