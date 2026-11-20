import type { AudienceKey } from "./mexty";

const img = (hash: string) => `/img/${hash}.jpg`;

export const MEXTY_URL = "https://mexty.ai";
export const EDVERSE_URL = "https://workspace.mexty.ai/edverse";

/** One picture per audience, in the order of PERSONAS below. */
export const IMG = [
  img("7a3abcdd050e373b573646aaecae935e"), // profs
  img("d00249b201e3351f3e44783c11f37eb1"), // créateurs
  img("05432e912ae2335ec14dd1b2660f1d57"), // learning designers
  img("440873b6ffc50b0812a466d93775854c"), // parents
  img("cedb36cacfd90d4742a577390d63abf0"), // l'atelier
];
export const COLOR = ["#4FD1A5", "#FFC94D", "#6E8BFF", "#F0569B", "#FF8A4C"];
export const SHADE = [
  "rgba(14,60,46,.95)",
  "rgba(80,52,4,.95)",
  "rgba(20,30,90,.95)",
  "rgba(90,14,50,.95)",
  "rgba(90,40,14,.95)",
];

export type Persona = {
  key: AudienceKey;
  name: string;
  who: string;
  full: string;
  /** Planned tutorials, shown while no published one carries this audience tag. */
  planned: number;
};

export const PERSONAS: Persona[] = [
  { key: "pour-profs", name: "Profs", who: "Prof", full: "Des cours et des quiz prêts pour ta classe", planned: 5 },
  { key: "pour-createurs", name: "Créateurs", who: "Créateur", full: "Crée des jeux et vends-les sur EdVerse", planned: 6 },
  { key: "pour-designers", name: "Learning designers", who: "Learning designer", full: "Des parcours complets, plus vite, sans rogner sur la qualité", planned: 6 },
  { key: "pour-parents", name: "Parents", who: "Parent", full: "Des jeux bien choisis et des révisions faites maison", planned: 4 },
];

/** Display order of the "Pour qui" cards (learning designers first). */
export const PERSONA_ORDER = [2, 0, 3, 1];

/**
 * Shown in "Les plus suivis" until five tutorials are published on Mexty.
 * [title, persona index, minutes]
 */
export const PLACEHOLDER_TOP: [string, number, number][] = [
  ["Ton premier cours Mexty en 10 minutes", 0, 10],
  ["Claude, ChatGPT ou Gemini : lequel pour scénariser un module ?", 2, 14],
  ["Publier ton jeu sur EdVerse et le monétiser", 1, 15],
  ["Un quiz qui corrige et explique tout seul", 0, 12],
  ["Trouver le bon jeu EdVerse pour son enfant", 3, 5],
];

const GAMES: Record<string, string> = {
  grimoria: img("38f95c182dae6685e736f56e34c70f15"),
  prism: img("0c780d4488a22e379c77aff9c0b6cab4"),
  prismlab: img("d00249b201e3351f3e44783c11f37eb1"),
  iceberg: img("fced05d947bf7c6429fd1716467dc429"),
  verbcup: img("440873b6ffc50b0812a466d93775854c"),
  ticktock: img("8d210ac84ae5d1c7f097202eaa604d0e"),
  songthaew: img("cedb36cacfd90d4742a577390d63abf0"),
  paintlings: img("1e8466f2ce3c784ddc16ed49f82132eb"),
  robotpet: img("b5bbfa6a10b9ad93114b9a5f61e35de3"),
};
const SHOTS = [
  "c48936ee25006eec146f2e880bb48bea",
  "06c08b4370813d06a58395f11c1f6e24",
  "f354086641297ac15f86ccf22eca9560",
  "2f10403287a6a99c1d65b799cc2a3093",
  "7a3abcdd050e373b573646aaecae935e",
  "0078c03cb3e1eeac9eb3645f5b23732e",
  "5ced4f034810bcbc308563052c7d5a5a",
  "9d0863dbe8ad1c1bdf9c466e5bba9358",
  "05432e912ae2335ec14dd1b2660f1d57",
  "8bfb8f6b09e9e806ff75e0331e3e70d6",
  "f6c54c2ff4bc9b631fb09e4db17fb34a",
].map(img);
const SHOTNAME = [
  "Les bons réflexes",
  "Les lignes rouges",
  "Les lignes rouges",
  "Les lignes rouges",
  "C'est quoi, l'IA ?",
  "C'est quoi, l'IA ?",
  "Dire quand c'est l'IA",
  "Dire quand c'est l'IA",
  "Branche marketing",
  "Branche marketing",
  "Branche relation client",
];

export type WallItem = { img: string; chip?: string };
const G1 = (k: string): WallItem => ({ img: GAMES[k] });
const S1 = (i: number): WallItem => ({ img: SHOTS[i], chip: "AI Act · " + SHOTNAME[i] });

export const WALL: { delay: string; dir: "alternate" | "alternate-reverse"; items: WallItem[] }[] = [
  { delay: "0s", dir: "alternate", items: [S1(0), G1("prism"), S1(8), G1("verbcup"), S1(3)] },
  { delay: "-6s", dir: "alternate-reverse", items: [G1("grimoria"), S1(5), G1("songthaew"), S1(1), G1("prismlab")] },
  { delay: "-3s", dir: "alternate", items: [S1(10), G1("ticktock"), S1(4), G1("iceberg"), S1(7)] },
  { delay: "-10s", dir: "alternate-reverse", items: [S1(2), G1("paintlings"), S1(9), G1("robotpet"), S1(6)] },
];

/** A card of the Ride Studio Sessions rail (built from Ride Studio's public list, lib/ride.ts). */
export type RideSession = { title: string; duration: string; date: string; url: string; thumb?: string; no?: number };
