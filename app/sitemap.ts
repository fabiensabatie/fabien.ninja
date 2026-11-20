import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getSessions } from "@/lib/ride";

// Tutorial pages are left out on purpose: their canonical URL is the mexty.ai
// article, which mexty.ai's own sitemap lists.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sessions = await getSessions();
  return [
    { url: `${SITE_URL}/ride`, changeFrequency: "daily", priority: 0.7 },
    ...sessions.map((s) => ({ url: `${SITE_URL}/ride/${s.no}`, lastModified: new Date(s.endedAt), changeFrequency: "monthly" as const, priority: 0.5 })),
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/tutos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/radio`, changeFrequency: "daily", priority: 0.6 },
  ];
}
