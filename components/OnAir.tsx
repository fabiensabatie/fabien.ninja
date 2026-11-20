"use client";

import { useEffect, useState } from "react";
import type { RadioData } from "@/lib/radio";

/** The live badge: what Radio Monkey is playing during a ride, refreshed every 20 s. */
export default function OnAir({ initial }: { initial: RadioData["live"] }) {
  const [live, setLive] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      fetch("/api/radio").then((r) => (r.ok ? r.json() : null)).then((j) => j && setLive(j)).catch(() => {});
    }, 20_000);
    return () => clearInterval(t);
  }, []);
  const on = live.on && live.track;
  return (
    <div className="panel" aria-live="polite" style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <span
        aria-hidden="true"
        style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 26, background: on ? "#FFC94D" : "var(--fill)", overflow: "hidden" }}
      >
        {on && live.track?.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={live.track.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          "🐒"
        )}
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
        <span className="eyebrow" style={{ color: on ? "#F0569B" : "var(--faint)" }}>{on ? "● À l'antenne, en pleine ride" : "Hors antenne"}</span>
        <strong style={{ fontSize: 18 }}>{on ? `${live.track!.title} · ${live.track!.artist}` : "La radio tourne pendant les sessions Ride Studio."}</strong>
      </span>
    </div>
  );
}
