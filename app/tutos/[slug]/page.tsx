import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { COLOR, PERSONAS } from "@/lib/content";
import { REVALIDATE, audiencesOf, canonicalUrl, getTutorial, resultOf, themeOf } from "@/lib/mexty";

export const revalidate = REVALIDATE;
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

type Params = { slug: string };

function readSlug(raw: string) {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/**
 * The article is HTML written by Mexty staff and already rendered as-is on
 * mexty.ai. Scripts and inline event handlers are still dropped here: this
 * site has no reason to run code from an article.
 */
function cleanHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const t = await getTutorial(readSlug((await params).slug));
  if (!t) return { title: "Tuto introuvable", robots: { index: false } };
  const title = t.seoTitle || t.title;
  const description = t.seoDescription || t.excerpt || title;
  return {
    title,
    description,
    // The mexty.ai article is the original: search engines credit it, and
    // this page does not compete with it.
    alternates: { canonical: canonicalUrl(t.slug) },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/tutos/${encodeURIComponent(t.slug)}`,
      publishedTime: t.publishedAt,
      modifiedTime: t.updatedAt,
      ...(t.featuredImage ? { images: [t.featuredImage] } : {}),
    },
  };
}

export default async function TutoPage({ params }: { params: Promise<Params> }) {
  const t = await getTutorial(readSlug((await params).slug));
  if (!t) notFound();
  const result = resultOf(t);
  const theme = themeOf(t);
  const aud = audiencesOf(t);
  const date = t.publishedAt
    ? new Date(t.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <>
      <SiteHeader />
      <main id="contenu" className="wrap" style={{ paddingTop: 48, paddingBottom: 96 }}>
        <article style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <header style={{ maxWidth: 760, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
            <nav aria-label="Fil d'Ariane" style={{ fontSize: 14, color: "var(--muted)" }}>
              <Link href="/">Accueil</Link> <span aria-hidden="true">/</span> <Link href="/tutos">Tutos</Link>
            </nav>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {theme ? <span className="tag">{theme}</span> : null}
              {aud.map((a) => {
                const i = PERSONAS.findIndex((x) => x.key === a);
                return (
                  <Link key={a} href={`/tutos?pour=${a.replace("pour-", "")}`} className="tag">
                    <i style={{ background: COLOR[i] }} />{PERSONAS[i].name}
                  </Link>
                );
              })}
            </div>
            <h1 className="disp disp-xl" style={{ margin: 0, fontSize: 48, lineHeight: 1.06 }}>{t.title}</h1>
            {t.excerpt ? <p style={{ margin: 0, fontSize: 19, lineHeight: 1.55, color: "var(--soft)" }}>{t.excerpt}</p> : null}
            <p style={{ margin: 0, fontSize: 14, color: "var(--faint)" }}>
              {[t.author?.name, date, t.readingTime ? `${t.readingTime} min` : null].filter(Boolean).join(" · ")}
            </p>
          </header>

          {t.featuredImage ? (
            <div style={{ maxWidth: 960, margin: "0 auto", width: "100%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.featuredImage} alt="" style={{ display: "block", width: "100%", borderRadius: 24, border: "1px solid var(--line2)" }} />
            </div>
          ) : null}

          {result ? (
            <aside className="panel" style={{ maxWidth: 760, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: 24, display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
              <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span className="eyebrow">Le résultat</span>
                <strong>{result.kind === "bloc" ? "L'activité construite dans ce tuto" : "Le cours construit dans ce tuto"}</strong>
              </span>
              <a href={result.url} className="btn y" target="_blank" rel="noopener">
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z" fill="#1A1240" /></svg>
                L&apos;ouvrir sur Mexty
              </a>
            </aside>
          ) : null}

          <div className="article" dangerouslySetInnerHTML={{ __html: cleanHtml(t.content || "") }} />

          <footer style={{ maxWidth: 760, margin: "0 auto", width: "100%", paddingTop: 24, borderTop: "1px solid var(--line)", display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "var(--muted)" }}>
              Publié aussi sur <a href={canonicalUrl(t.slug)} style={{ color: "var(--acc)" }}>le blog Mexty</a>.
            </span>
            <Link href="/tutos" className="btn d">Tous les tutos</Link>
          </footer>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
