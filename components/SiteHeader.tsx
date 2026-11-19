import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { RIDE } from "@/lib/content";

/** Absolute over the hero on the homepage, in the flow on inner pages. */
export default function SiteHeader({ overlay = false, q = "" }: { overlay?: boolean; q?: string }) {
  return (
    <header
      style={{
        position: overlay ? "absolute" : "relative",
        zIndex: 5,
        left: 0,
        right: 0,
        top: 0,
        borderBottom: "1px solid var(--line)",
        background: "var(--hdr)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="wrap" style={{ height: 68, display: "flex", alignItems: "center", gap: 20 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 9,
              background: "linear-gradient(135deg,#FFC94D,#E8553A)", color: "#120F2B", fontFamily: "'Unbounded',sans-serif", fontWeight: 800, fontSize: 16,
            }}
          >
            F
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span className="disp" style={{ fontSize: 17 }}>fabien.ninja</span>
            <span style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>
              par le CTO de <span style={{ color: "var(--acc)", fontWeight: 600 }}>Mexty</span>
            </span>
          </span>
        </Link>
        <form action="/tutos" role="search" className="search srch" style={{ minWidth: 0, flex: 1, maxWidth: 300, height: 40 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <label style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }} htmlFor="hdr-q">
            Rechercher un tuto
          </label>
          <input id="hdr-q" type="search" name="q" placeholder="Quiz, jeu, ChatGPT…" defaultValue={q} />
        </form>
        <nav className="links" style={{ display: "flex", gap: 22, fontSize: 15, fontWeight: 500, marginLeft: "auto" }}>
          <Link href="/#publics">Pour qui</Link>
          <Link href="/#usecases">Cas d&apos;usage</Link>
          {RIDE.length ? <Link href="/#ride">Ride Studio</Link> : null}
          <Link href="/#ecosysteme">Mexty &amp; EdVerse</Link>
        </nav>
        <ThemeToggle />
        <Link href="/tutos" className="btn y" style={{ padding: "10px 16px", fontSize: 14, flexShrink: 0 }}>
          Tous les tutos
        </Link>
      </div>
    </header>
  );
}
