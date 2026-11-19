"use client";

import { useRef } from "react";
import type { RideSession } from "@/lib/content";

const pad2 = (n: number) => (n < 10 ? "0" : "") + n;

export default function RideRail({ sessions }: { sessions: RideSession[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
  };
  return (
    <section id="ride" className="wrap" style={{ paddingTop: 96, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="eyebrow">Ride Studio</span>
          <h2 className="disp disp-xl" style={{ margin: 0, fontSize: 44, lineHeight: 1.05 }}>Les sessions Ride Studio</h2>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: "var(--soft)", maxWidth: 560 }}>
            Les vidéos que je fais avec Ride Studio, session après session.
          </p>
        </div>
        <div className="rsnav">
          <button type="button" className="rsb" onClick={() => scroll(-1)} aria-label="Sessions précédentes">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <button type="button" className="rsb" onClick={() => scroll(1)} aria-label="Sessions suivantes">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
      <div className="rsg" ref={rail} tabIndex={0} aria-label="Sessions Ride Studio">
        {sessions.map((v, i) => {
          const n = pad2(sessions.length - i);
          return (
            <a key={v.url + i} href={v.url} className="rsc">
              <span className="th" style={v.thumb ? { backgroundImage: `url(${v.thumb})` } : undefined}>
                {i === 0 ? <span className="tag new" style={{ background: "#FFC94D", color: "#1A1240", border: 0 }}>Dernière session</span> : null}
                <span className="pl" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z" fill="currentColor" /></svg></span>
                <span className="num">{n}</span>
                <span className="dur">{v.duration}</span>
              </span>
              <span className="rsm" style={{ color: "var(--acc)" }}>Session {n}</span>
              <span style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.3 }}>{v.title}</span>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{v.date}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
