# fabien.ninja

Free tutorials for learning designers, teachers, parents and creators, built with Mexty, EdVerse and AI. Next.js 15 (App Router), no CSS framework. The styles come straight from the homepage design (`app/globals.css`).

## How tutorials get here

A tutorial is a **Mexty blog post tagged `tuto`**. Write it in the Mexty blog manager or with the MCP `create_blog` tool, then publish it. Within 10 minutes (ISR) it shows up:

- on fabien.ninja: in the homepage "Les plus suivis" row, on the audience cards, at `/tutos` and at `/tutos/<slug>`
- on mexty.ai: at `/tutorials` (the hub) and `/resources/blogs/<slug>`

The canonical URL of every tutorial is the **mexty.ai article**, so search engines credit Mexty and the two copies do not compete. fabien.ninja only reads the public API (published posts only, no key).

### Tags

Mexty drops any tag with a colon, so these use hyphens.

| Tag | Effect |
|---|---|
| `tuto` | Required. Lists the post as a tutorial |
| `pour-designers`, `pour-profs`, `pour-parents`, `pour-createurs` | Audience: card counts, filters, chips. The first one sets the card colour |
| `theme-mexty`, `theme-edverse`, `theme-ia` | Theme chip and filter |
| `bloc-<blockId>` or `cours-<courseId>` | The Mexty activity or course the tutorial builds: adds the "Le résultat" button |

Other fields used: `language` (only `fr` posts are listed), `featuredImage` (card and header image, otherwise the audience picture), `excerpt`, `readingTime`, `views` (ranks "Les plus suivis").

A **use case** line on the homepage links to the tutorial whose title is exactly the same text; until one exists it shows "bientôt" and searches `/tutos`.

## Ride Studio

The section stays hidden until `RIDE` in `lib/content.ts` has sessions (`title`, `duration`, `date`, `url`, optional `thumb`).

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # start listens on $PORT (Railway sets it)
```

Environment (see `.env.example`): `MEXTY_API_URL` (default `https://api.mexty.ai`), `SITE_URL` (default `https://fabien.ninja`).
