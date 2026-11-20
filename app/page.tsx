import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RideRail from "@/components/RideRail";
import OnAir from "@/components/OnAir";
import { getRadio } from "@/lib/radio";
import {
  COLOR, EDVERSE_URL, IMG, MEXTY_URL, PERSONAS, PERSONA_ORDER, PLACEHOLDER_TOP, RIDE, SHADE, WALL,
} from "@/lib/content";
import { USE_CASES } from "@/lib/usecases";
import { audiencesOf, getTutorials, type Tutorial } from "@/lib/mexty";

export const revalidate = 600; // must be a literal for Next.js; keep in step with REVALIDATE in lib/mexty.ts

export const metadata = { alternates: { canonical: "/" } };

const Play = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z" fill="#1A1240" /></svg>
);

const TRUST = [
  { bg: "#4FD1A5", ink: "#0E2A22", title: "Gratuit, toujours", sub: "Aucun compte, aucune pub", icon: <path d="M20 6L9 17l-5-5" /> },
  { bg: "#FFC94D", ink: "#3A2A05", title: "Des projets en vrai", sub: "AI Act, Prism, VerbCup : les coulisses", icon: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M10 9l5 3-5 3z" /></> },
  { bg: "#6E8BFF", ink: "#0F1A4A", title: "Toutes les IA, testées", sub: "Claude, GPT, Gemini : laquelle pour quoi", icon: <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></> },
  { bg: "#F0569B", ink: "#3A0A20", title: "Un résultat par tuto", sub: "Tu repars avec un cours ou un jeu publié", icon: <path d="M5 21V4M5 4h11l-2 4 2 4H5" /> },
];

/** Persona index of a tutorial, from its first audience tag (Profs if none). */
function personaOf(t: Tutorial) {
  const a = audiencesOf(t)[0];
  const i = PERSONAS.findIndex((p) => p.key === a);
  return i < 0 ? 0 : i;
}

type TopItem = { title: string; href: string; img: string; color: string; who: string; minutes?: number };

function topFive(tutorials: Tutorial[]): TopItem[] {
  const real: TopItem[] = [...tutorials]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map((t) => {
      const p = personaOf(t);
      return { title: t.title, href: `/tutos/${encodeURIComponent(t.slug)}`, img: t.featuredImage || IMG[p], color: COLOR[p], who: PERSONAS[p].name, minutes: t.readingTime };
    });
  // Until five tutorials are published, the design's planned ones fill the row.
  const fill: TopItem[] = PLACEHOLDER_TOP.filter(([title]) => !real.some((r) => r.title === title))
    .slice(0, 5 - real.length)
    .map(([title, p, m]) => ({ title, href: "/tutos", img: IMG[p], color: COLOR[p], who: PERSONAS[p].name, minutes: m }));
  return [...real, ...fill];
}

export default async function Home() {
  const [tutorials, radio] = await Promise.all([getTutorials(), getRadio()]);
  const byTitle = new Map(tutorials.map((t) => [t.title.trim().toLowerCase(), t]));
  const ucTotal = USE_CASES.reduce((a, c) => a + c.items.length, 0);
  const top = topFive(tutorials);

  return (
    <>
      <SiteHeader overlay />
      <main id="contenu">
        {/* Hero */}
        <section className="hm-hero" style={{ position: "relative", overflow: "hidden", paddingTop: 68 }}>
          <div className="hm-glow" aria-hidden="true" />
          <div className="wrap hm-grid" style={{ position: "relative", display: "grid", gridTemplateColumns: "minmax(0,560px) minmax(0,1fr)", gap: 40, alignItems: "center", minHeight: 780 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 580, paddingTop: 24, position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <span className="tag" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase" }}>
                  <i style={{ background: "#4FD1A5" }} />Learning designers · profs · parents · créateurs
                </span>
              </div>
              <h1 className="h1 disp" style={{ margin: 0, fontSize: 72, lineHeight: 1.0, fontWeight: 800 }}>
                Donne <span className="grad">envie</span> d&apos;apprendre.
              </h1>
              <p style={{ margin: 0, fontSize: 19, lineHeight: 1.55, color: "var(--soft)", maxWidth: 500 }}>
                Des tutos gratuits pour créer des cours, des quiz et des jeux avec Mexty, EdVerse et l&apos;IA. Pensés pour les learning designers, les profs, les parents et les créateurs.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="#publics" className="btn y"><Play />Trouver mon parcours</a>
                <a href="#populaires" className="btn d">Voir les tutos</a>
              </div>
            </div>
            <div className="hm-wall" aria-hidden="true">
              <div className="hm-tilt">
                {WALL.map((col, ci) => (
                  <div key={ci} className="hm-col" style={{ animationDelay: col.delay, animationDirection: col.dir }}>
                    {col.items.map((it, ii) => (
                      <div key={ii} className="hm-cover">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={it.img} alt="" loading={ii < 2 ? "eager" : "lazy"} />
                        {it.chip ? <span className="shot-chip">{it.chip}</span> : null}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hm-fade" aria-hidden="true" />
        </section>

        {/* Trust strip */}
        <section style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--fill)" }}>
          <div className="wrap trust" style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))" }}>
            {TRUST.map((t, i) => (
              <div key={t.title} style={{ display: "flex", gap: 12, alignItems: "center", padding: "18px 16px", borderLeft: i ? "1px solid var(--line)" : undefined }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: t.bg, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{t.icon}</svg>
                </span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <strong style={{ fontSize: 15 }}>{t.title}</strong>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>{t.sub}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section id="usecases" className="wrap" style={{ paddingTop: 96, display: "flex", flexDirection: "column", gap: 20 }}>
          <span className="eyebrow">Cas d&apos;usage</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
            <h2 className="disp disp-xl" style={{ margin: 0, fontSize: 44, lineHeight: 1.05 }}>Ce que tu peux faire, concrètement</h2>
            <span style={{ fontSize: 14, color: "var(--muted)" }}>{ucTotal} idées concrètes</span>
          </div>
          <div className="three" style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 16 }}>
            {USE_CASES.map((c) => (
              <div key={c.tag} className="panel" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", height: 170, overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMG[c.img]} alt="" loading="lazy" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
                  <span className="tag" style={{ position: "absolute", left: 16, top: 16, background: c.color, color: c.ink, border: 0 }}>{c.tag}</span>
                </div>
                <div style={{ padding: "22px 24px 20px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                  <h3 className="disp" style={{ margin: 0, fontSize: 22, lineHeight: 1.15 }}>{c.title}</h3>
                  <div className="ucv" tabIndex={0} aria-label={`${c.title} : ${c.items.length} tutos`}>
                    <div className="uct">
                      {c.items.map((t, k) => {
                        const n = (k < 9 ? "0" : "") + (k + 1);
                        const tuto = byTitle.get(t.trim().toLowerCase());
                        const thumb = tuto?.featuredImage;
                        return (
                          <Link key={t} href={tuto ? `/tutos/${encodeURIComponent(tuto.slug)}` : `/tutos?q=${encodeURIComponent(t)}`} className="uci">
                            <span className="bar" style={{ background: c.color }} />
                            <span className="th" style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}>
                              {thumb ? null : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-9 9" /></svg>
                              )}
                              <span className="num" style={{ background: c.color, color: c.ink }}>{n}</span>
                            </span>
                            <span><span className="meta">{tuto ? `Tuto ${n}` : `Tuto ${n} · bientôt`}</span>{t}</span>
                            <span className="go" aria-hidden="true">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingTop: 14, borderTop: "1px solid var(--line)", fontSize: 13, color: "var(--muted)" }}>
                    <span style={{ fontWeight: 600 }}>{c.items.length} tutos</span>
                    <span>Fais défiler pour tout voir</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Audiences */}
        <section id="publics" className="wrap" style={{ paddingTop: 96, display: "flex", flexDirection: "column", gap: 20 }}>
          <span className="eyebrow">Pour qui</span>
          <h2 className="disp disp-xl" style={{ margin: 0, fontSize: 44, lineHeight: 1.05 }}>Des tutos adaptés à votre profil</h2>
          <div className="whos" style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 16 }}>
            {PERSONA_ORDER.map((i) => {
              const p = PERSONAS[i];
              const n = tutorials.filter((t) => t.tags?.includes(p.key)).length;
              return (
                <Link key={p.key} href={`/tutos?pour=${p.key.replace("pour-", "")}`} className="who">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="bg" src={IMG[i]} alt="" loading="lazy" />
                  <span className="ov" style={{ background: `linear-gradient(180deg,rgba(0,0,0,0) 30%,${SHADE[i]} 100%)` }} />
                  <span className="tag" style={{ position: "absolute", left: 12, top: 12, background: COLOR[i], color: "#120F2B", border: 0 }}>
                    {n ? `${n} tuto${n > 1 ? "s" : ""}` : "Bientôt"}
                  </span>
                  <span className="in">
                    <span className="disp" style={{ fontSize: 30, lineHeight: 1 }}>{p.name}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, opacity: 0.92 }}>{p.full}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Top 5 */}
        <section id="populaires" className="wrap" style={{ paddingTop: 96, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span className="eyebrow">Les plus suivis</span>
              <h2 className="disp disp-xl" style={{ margin: 0, fontSize: 44, lineHeight: 1.05 }}>Ce que tout le monde regarde</h2>
            </div>
            <Link href="/tutos" style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>Tous les tutos <span aria-hidden="true">→</span></Link>
          </div>
          <div className="ranks" style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", gap: 18 }}>
            {top.map((r, k) => (
              <Link key={r.title} href={r.href} className="rank">
                <span className="num" aria-hidden="true" style={{ color: r.color }}>{k + 1}</span>
                <div className="ph">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.img} alt="" loading="lazy" />
                  <span className="free">Gratuit</span>
                </div>
                <span style={{ position: "relative", fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{r.title}</span>
                <span style={{ position: "relative", fontSize: 13, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: r.color }} />
                  {r.who}{r.minutes ? ` · ${r.minutes} min` : ""}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {RIDE.length ? <RideRail sessions={RIDE} /> : null}

        {radio.tracks.length || radio.live.on ? (
          <section id="radio" className="wrap" style={{ paddingTop: 96, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <span className="eyebrow">Ride Studio</span>
                <h2 className="disp disp-xl" style={{ margin: 0, fontSize: 44, lineHeight: 1.05 }}>Radio <span className="grad">Monkey</span></h2>
                <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: "var(--soft)", maxWidth: 560 }}>
                  La musique qui tourne pendant les sessions. {radio.tracks.length} morceau{radio.tracks.length > 1 ? "x" : ""} déjà diffusé{radio.tracks.length > 1 ? "s" : ""}.
                </p>
              </div>
              <Link href="/radio" style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>Tous les morceaux <span aria-hidden="true">→</span></Link>
            </div>
            <OnAir initial={radio.live} />
          </section>
        ) : null}

        {/* Mexty & EdVerse */}
        <section id="ecosysteme" className="wrap" style={{ paddingTop: 96, display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="two" style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 18 }}>
            <a href={MEXTY_URL} className="panel promo">
              <span className="orb" aria-hidden="true" style={{ background: "radial-gradient(circle at 35% 35%,#FF8A4C,#E8553A 60%,#7A2A3A)" }} />
              <span className="eyebrow">Mexty · learning designers et profs</span>
              <div className="disp" style={{ position: "relative", fontSize: 32, lineHeight: 1.08, maxWidth: 420 }}>Ton premier cours, en dix minutes.</div>
              <p style={{ position: "relative", margin: 0, fontSize: 16, lineHeight: 1.55, color: "var(--soft)", maxWidth: 400 }}>
                La plateforme pour créer des cours, des quiz, des jeux et des médias avec l&apos;IA, sans coder.
              </p>
              <div style={{ position: "relative", display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span className="tag"><i style={{ background: "#4FD1A5" }} />Sans code</span>
                <span className="tag"><i style={{ background: "#FFC94D" }} />IA intégrée</span>
              </div>
              <span className="btn y" style={{ position: "relative", alignSelf: "flex-start", marginTop: "auto" }}>Découvrir Mexty</span>
            </a>
            <a href={EDVERSE_URL} className="panel promo">
              <span className="orb" aria-hidden="true" style={{ background: "radial-gradient(circle at 35% 35%,#4FD1A5,#2E7FD8 60%,#24306A)" }} />
              <span className="eyebrow" style={{ color: "var(--acc2)" }}>EdVerse · créateurs et parents</span>
              <div className="disp" style={{ position: "relative", fontSize: 32, lineHeight: 1.08, maxWidth: 420 }}>Fais un jeu. Garde 80&nbsp;%.</div>
              <p style={{ position: "relative", margin: 0, fontSize: 16, lineHeight: 1.55, color: "var(--soft)", maxWidth: 400 }}>
                Le store de jeux éducatifs des 4 à 18 ans. Les créateurs y vendent leurs jeux, les parents y trouvent les bons.
              </p>
              <div style={{ position: "relative", display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span className="tag"><i style={{ background: "#6E8BFF" }} />Sans code</span>
                <span className="tag"><i style={{ background: "#F0569B" }} />Payé chaque mois</span>
              </div>
              <span className="btn m" style={{ position: "relative", alignSelf: "flex-start", marginTop: "auto" }}>Découvrir EdVerse</span>
            </a>
          </div>
        </section>

        {/* Final CTA */}
        <section className="wrap" style={{ paddingTop: 96, paddingBottom: 96 }}>
          <div className="panel ctabg" style={{ position: "relative", overflow: "hidden", padding: "64px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
            <span className="eyebrow">Sans inscription</span>
            <div className="disp disp-xl" style={{ fontSize: 56, lineHeight: 1.02, fontWeight: 800 }}>Choisis ton parcours. Appuie sur play.</div>
            <p style={{ margin: 0, fontSize: 17, color: "var(--soft)" }}>
              Learning designer, prof, parent ou créateur&nbsp;: chaque tuto s&apos;ouvre en un clic, dans le navigateur.
            </p>
            <a href="#publics" className="btn y" style={{ marginTop: 8 }}><Play />Trouver mon parcours</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
