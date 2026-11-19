import Link from "next/link";
import { EDVERSE_URL, MEXTY_URL } from "@/lib/content";

export default function SiteFooter() {
  return (
    <>
      <div className="band" aria-hidden="true" />
      <footer style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap three" style={{ paddingTop: 48, paddingBottom: 32, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="disp" style={{ fontSize: 20 }}>fabien.ninja</span>
            <span style={{ fontSize: 14, lineHeight: 1.6, color: "var(--muted)", maxWidth: 300 }}>
              Tutos gratuits pour les learning designers, les profs, les parents et les créateurs, avec Mexty, EdVerse et l&apos;IA. Un site de Fabien, CTO de Mexty.
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
            <span className="eyebrow" style={{ fontSize: 11, color: "var(--faint)" }}>Pour qui</span>
            <Link href="/tutos?pour=designers">Learning designers</Link>
            <Link href="/tutos?pour=profs">Profs</Link>
            <Link href="/tutos?pour=parents">Parents</Link>
            <Link href="/tutos?pour=createurs">Créateurs</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
            <span className="eyebrow" style={{ fontSize: 11, color: "var(--faint)" }}>Thèmes</span>
            <Link href="/tutos?theme=mexty">Mexty</Link>
            <Link href="/tutos?theme=edverse">EdVerse</Link>
            <Link href="/tutos?theme=ia">IA</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
            <span className="eyebrow" style={{ fontSize: 11, color: "var(--faint)" }}>Écosystème</span>
            <a href={MEXTY_URL}>Mexty</a>
            <a href={EDVERSE_URL}>EdVerse</a>
            <span style={{ color: "var(--faint)" }}>MexTribe, bientôt</span>
          </div>
        </div>
        <div className="wrap" style={{ paddingBottom: 40 }}>
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", fontSize: 13, color: "var(--faint)" }}>
            <span><strong style={{ color: "var(--text)" }}>Français</strong> · English (bientôt)</span>
            <a href="mailto:hello@fabien.ninja" style={{ color: "var(--faint)" }}>hello@fabien.ninja</a>
          </div>
        </div>
      </footer>
    </>
  );
}
