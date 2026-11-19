/**
 * Tutorials come from Mexty: they are blog posts tagged "tuto", written in the
 * Mexty blog manager or with the MCP create_blog tool. This site only reads the
 * public API (published posts only, no auth). The canonical URL of every
 * tutorial is its mexty.ai article, so the search ranking goes to Mexty.
 *
 * Tag conventions (Mexty drops tags containing a colon, hence the hyphens):
 *   tuto                                   listed on fabien.ninja and mexty.ai/tutorials
 *   pour-designers | pour-profs | pour-parents | pour-createurs   audience
 *   theme-mexty | theme-edverse | theme-ia                        theme
 *   bloc-<blockId> | cours-<courseId>      the Mexty result the tutorial builds
 */

const RAW = process.env.MEXTY_API_URL || "https://api.mexty.ai";
const STRIPPED = RAW.replace(/\/+$/, "");
const API = STRIPPED.endsWith("/api") ? STRIPPED : `${STRIPPED}/api`;

export const MEXTY_SITE = "https://mexty.ai";
export const TUTO_TAG = "tuto";
export const REVALIDATE = 600;

export type Tutorial = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featuredImage?: string;
  tags?: string[];
  language?: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: number;
  views?: number;
  author?: { name?: string };
};

export type AudienceKey = "pour-designers" | "pour-profs" | "pour-parents" | "pour-createurs";

export const AUDIENCE_TAGS: AudienceKey[] = ["pour-designers", "pour-profs", "pour-parents", "pour-createurs"];

export const THEME_LABELS: Record<string, string> = {
  "theme-mexty": "Mexty",
  "theme-edverse": "EdVerse",
  "theme-ia": "IA",
};

export function canonicalUrl(slug: string) {
  return `${MEXTY_SITE}/resources/blogs/${encodeURIComponent(slug)}`;
}

/** The Mexty block or course a tutorial produces, read from its tags. */
export function resultOf(t: Tutorial): { kind: "bloc" | "cours"; id: string; url: string } | null {
  for (const tag of t.tags || []) {
    const m = /^(bloc|cours)-([a-f0-9]{24})$/i.exec(tag);
    if (!m) continue;
    const kind = m[1].toLowerCase() as "bloc" | "cours";
    const id = m[2];
    const url =
      kind === "bloc"
        ? `${MEXTY_SITE}/blocks/preview?blockId=${id}`
        : `${MEXTY_SITE}/courses/preview?courseId=${id}`;
    return { kind, id, url };
  }
  return null;
}

export function themeOf(t: Tutorial): string | null {
  const tag = (t.tags || []).find((x) => THEME_LABELS[x]);
  return tag ? THEME_LABELS[tag] : null;
}

export function audiencesOf(t: Tutorial): AudienceKey[] {
  return AUDIENCE_TAGS.filter((a) => t.tags?.includes(a));
}

/** Published tutorials, newest first. Fails soft: an API error lists none. */
export async function getTutorials(language = "fr"): Promise<Tutorial[]> {
  try {
    const params = new URLSearchParams({ tags: TUTO_TAG, limit: "50" });
    if (language) params.set("language", language);
    const res = await fetch(`${API}/blog?${params}`, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return [];
    const json = await res.json();
    const posts: Tutorial[] = json?.data?.posts || [];
    return posts.filter((p) => p && p.slug && p.title);
  } catch {
    return [];
  }
}

/** One tutorial, or null if it does not exist or is not tagged "tuto". */
export async function getTutorial(slug: string): Promise<Tutorial | null> {
  const res = await fetch(`${API}/blog/${encodeURIComponent(slug)}`, {
    next: { revalidate: REVALIDATE },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Tutorial unavailable (${res.status})`);
  const json = await res.json();
  const post: Tutorial | undefined = json?.data;
  if (!post || !post.tags?.includes(TUTO_TAG)) return null;
  return post;
}
