import Link from "next/link";
import { COLOR, IMG, PERSONAS } from "@/lib/content";
import { audiencesOf, themeOf, type Tutorial } from "@/lib/mexty";

export default function TutoCard({ t }: { t: Tutorial }) {
  const aud = audiencesOf(t);
  const p = Math.max(0, PERSONAS.findIndex((x) => x.key === aud[0]));
  const theme = themeOf(t);
  return (
    <Link href={`/tutos/${encodeURIComponent(t.slug)}`} className="card">
      <div className="ph">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.featuredImage || IMG[p]} alt="" loading="lazy" />
        <span className="free">Gratuit</span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {theme ? <span className="tag">{theme}</span> : null}
        {aud.map((a) => {
          const i = PERSONAS.findIndex((x) => x.key === a);
          return (
            <span key={a} className="tag"><i style={{ background: COLOR[i] }} />{PERSONAS[i].name}</span>
          );
        })}
      </div>
      <span style={{ fontWeight: 700, fontSize: 17, lineHeight: 1.3, color: "var(--text)" }}>{t.title}</span>
      {t.excerpt ? <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--muted)" }}>{t.excerpt}</span> : null}
      {t.readingTime ? <span style={{ fontSize: 13, color: "var(--faint)" }}>{t.readingTime} min</span> : null}
    </Link>
  );
}
