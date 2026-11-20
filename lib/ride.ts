import { RIDE_STUDIO_URL } from "./radio";

/**
 * Ride Studio Sessions: every finished session Ride Studio publishes at GET /api/public/sessions. The videos stay
 * on Ride Studio's volume and play from there; this site only reads the list. A session shows up here within a
 * minute of its end, and its video once the phone has uploaded it.
 */
export type SessionVideo = { variant: "tall" | "wide"; part: number; url: string };
export type SessionContent = { kind: string; title: string; url: string | null };
export type TranscriptLine = { atSec: number; who: "fabien" | "claude" | "studio"; text: string };
export type Session = {
  no: number;
  title: string;
  company: string;
  destination: string;
  topic: string;
  startedAt: number;
  endedAt: number;
  durationSec: number;
  stats: Record<string, number>;
  beats: { label: string; atSec: number }[];
  delivered: SessionContent[];
  videos: SessionVideo[];
  thumb: string | null;
  transcript?: TranscriptLine[];
};

/** Fails soft: Ride Studio down or not configured means no sessions, never a broken page. */
export async function getSessions(revalidate = 60): Promise<Session[]> {
  if (!RIDE_STUDIO_URL) return [];
  try {
    const res = await fetch(`${RIDE_STUDIO_URL}/api/public/sessions`, { next: { revalidate }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const j = (await res.json()) as { sessions?: Session[] };
    return Array.isArray(j.sessions) ? j.sessions : [];
  } catch {
    return [];
  }
}

export async function getSession(no: string, revalidate = 60): Promise<Session | null> {
  if (!RIDE_STUDIO_URL || !/^\d{1,6}$/.test(no)) return null;
  try {
    const res = await fetch(`${RIDE_STUDIO_URL}/api/public/sessions/${no}`, { next: { revalidate }, signal: AbortSignal.timeout(5000) });
    return res.ok ? ((await res.json()) as Session) : null;
  } catch {
    return null;
  }
}

export const KIND: Record<string, string> = { program: "Parcours", course: "Cours", block: "Activité", scene: "Jeu 3D", evaluation: "Évaluation" };

export const fmtClock = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.round(s % 60);
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
};
export const fmtDay = (ts: number) => new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });

/** The card on the homepage rail. */
export const toCard = (s: Session) => ({
  title: s.title,
  duration: fmtClock(s.durationSec),
  date: [fmtDay(s.endedAt), s.company && s.company !== s.title ? s.company : null].filter(Boolean).join(" · "),
  url: `/ride/${s.no}`,
  thumb: s.thumb ?? undefined,
  no: s.no,
});
