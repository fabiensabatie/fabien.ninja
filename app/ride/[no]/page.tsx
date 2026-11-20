import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { fmtClock, fmtDay, getSession, KIND } from "@/lib/ride";

export const revalidate = 60;
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

type Params = { no: string };
const WHO: Record<string, string> = { fabien: "Fabien", claude: "Claude", studio: "Studio", guest: "Invité" };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const s = await getSession((await params).no);
  if (!s) return { title: "Session introuvable", robots: { index: false } };
  const description = `Session ${s.no} de Ride Studio${s.company ? ` vers ${s.company}` : ""} : ${s.title}. La vidéo, la formation livrée en accès libre et le transcript.`;
  return {
    title: `${s.title} · Ride Studio Session ${s.no}`,
    description,
    alternates: { canonical: `/ride/${s.no}` },
    openGraph: { type: "video.other", title: s.title, description, url: `/ride/${s.no}`, ...(s.thumb ? { images: [s.thumb] } : {}) },
  };
}

export default async function SessionPage({ params }: { params: Promise<Params> }) {
  const s = await getSession((await params).no);
  if (!s) notFound();
  const wide = s.videos.filter((v) => v.variant === "wide");
  const tall = s.videos.filter((v) => v.variant === "tall");
  const main = wide.length ? wide : tall;
  const stats: [number, string][] = (
    [
      [s.stats.slides, "écrans"],
      [s.stats.questions, "questions"],
      [s.stats.nodes, "étapes"],
      [s.stats.objects, "objets 3D"],
    ] as [number, string][]
  ).filter(([n]) => n > 0);

  return (
    <>
      <SiteHeader />
      <main id="contenu" className="wrap" style={{ paddingTop: 48, paddingBottom: 96, display: "flex", flexDirection: "column", gap: 24 }}>
        <Link href="/ride" style={{ fontWeight: 700, fontSize: 14 }}>← Ride Studio Sessions</Link>
        <span className="eyebrow">Session {s.no}{s.company ? ` · ${s.company}` : ""}</span>
        <h1 className="disp disp-xl" style={{ margin: 0, fontSize: 48, lineHeight: 1.05, fontWeight: 800 }}>{s.title}</h1>
        <p style={{ margin: 0, fontSize: 16, color: "var(--muted)" }}>
          {[fmtDay(s.endedAt), `${fmtClock(s.durationSec)} de route`, s.destination || null].filter(Boolean).join(" · ")}
        </p>

        {main.length ? (
          <div className={`ride-videos${wide.length && tall.length ? " both" : ""}`}>
            {main.map((v) => (
              <video key={v.url} src={v.url} poster={s.thumb ?? undefined} controls playsInline preload="metadata" className="ride-video" style={v.variant === "wide" ? { aspectRatio: "16 / 9" } : { aspectRatio: "9 / 16", maxWidth: 400, maxHeight: "none", marginInline: "auto" }} />
            ))}
            {wide.length && tall.length ? (
              <details className="panel" style={{ padding: "14px 18px" }}>
                <summary style={{ cursor: "pointer", fontWeight: 700 }}>Version verticale (9:16)</summary>
                {tall.map((v) => (
                  <video key={v.url} src={v.url} controls playsInline preload="none" className="ride-video" style={{ aspectRatio: "9 / 16", maxWidth: 320, marginTop: 12 }} />
                ))}
              </details>
            ) : null}
          </div>
        ) : (
          <div className="panel" style={{ padding: 28, color: "var(--muted)" }}>La vidéo est en route : elle apparaît ici dès que le téléphone l&apos;a envoyée.</div>
        )}

        <section aria-labelledby="livre" style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 8 }}>
          <h2 id="livre" className="disp" style={{ margin: 0, fontSize: 28 }}>Ce qui a été livré</h2>
          {stats.length ? <p style={{ margin: 0, color: "var(--soft)" }}>{stats.map(([n, l]) => `${n} ${l}`).join(" · ")}</p> : null}
          {s.delivered.length ? (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {s.delivered.map((d, i) => (
                <li key={i} className="panel" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
                    <span className="eyebrow" style={{ fontSize: 11 }}>{KIND[d.kind] ?? "Contenu"}</span>
                    <strong style={{ fontSize: 17 }}>{d.title}</strong>
                  </span>
                  {d.url ? (
                    <a href={d.url} target="_blank" rel="noopener" className="btn y" style={{ padding: "10px 16px", fontSize: 15 }}>Suivre gratuitement</a>
                  ) : (
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>Lien public bientôt</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0, color: "var(--muted)" }}>Rien n&apos;a été livré pendant cette session.</p>
          )}
        </section>

        {s.beats.length ? (
          <section aria-labelledby="moments" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <h2 id="moments" className="disp" style={{ margin: 0, fontSize: 28 }}>Moments</h2>
            <p style={{ margin: 0, color: "var(--soft)" }}>{s.beats.map((b) => `${fmtClock(b.atSec)} ${b.label}`).join(" · ")}</p>
          </section>
        ) : null}

        {s.transcript?.length ? (
          <section aria-labelledby="transcript" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 id="transcript" className="disp" style={{ margin: 0, fontSize: 28 }}>Transcript</h2>
            <ol className="ride-transcript">
              {s.transcript.map((l, i) => (
                <li key={i} className={`who-${l.who}`}>
                  <span className="t">{fmtClock(l.atSec)}</span>
                  <span className="w">{l.name || WHO[l.who] || l.who}</span>
                  <span className="x">{l.text}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
