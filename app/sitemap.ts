import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Tutorial pages are left out on purpose: their canonical URL is the mexty.ai
// article, which mexty.ai's own sitemap lists.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/tutos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/radio`, changeFrequency: "daily", priority: 0.6 },
  ];
}
