/**
 * Radio Monkey lives in Ride Studio: it plays under the ride episodes. Ride Studio publishes what is on air
 * and every track it has broadcast at GET /api/public/radio; this site only reads that list.
 */
export const RIDE_STUDIO_URL = (process.env.RIDE_STUDIO_URL || "").replace(/\/+$/, "");

export type RadioTrack = {
  id: string;
  title: string;
  artist: string;
  durationSec?: number;
  cover?: string;
  url: string;
  plays?: number;
  firstPlayedAt?: number;
  lastPlayedAt?: number;
};
export type RadioData = {
  name: string;
  live: { on: boolean; track: RadioTrack | null; startedAt: number };
  tracks: RadioTrack[];
};

export const EMPTY_RADIO: RadioData = { name: "Radio Monkey", live: { on: false, track: null, startedAt: 0 }, tracks: [] };

/** Fails soft: Ride Studio down or not configured means an empty radio, never a broken page. */
export async function getRadio(revalidate = 60): Promise<RadioData> {
  if (!RIDE_STUDIO_URL) return EMPTY_RADIO;
  try {
    const res = await fetch(`${RIDE_STUDIO_URL}/api/public/radio`, {
      next: { revalidate },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return EMPTY_RADIO;
    const j = (await res.json()) as RadioData;
    return { name: j.name || "Radio Monkey", live: j.live ?? EMPTY_RADIO.live, tracks: Array.isArray(j.tracks) ? j.tracks : [] };
  } catch {
    return EMPTY_RADIO;
  }
}

export const fmtDuration = (s?: number) =>
  s ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}` : "";
