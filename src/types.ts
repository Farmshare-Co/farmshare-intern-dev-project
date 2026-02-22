export const EAnimalSpecies = {
  beef: "beef",
  hog: "hog",
  bison: "bison",
  lamb: "lamb",
  goat: "goat",
  venison: "venison",
  yak: "yak",
  veal: "veal",
} as const;

export type EAnimalSpecies =
  (typeof EAnimalSpecies)[keyof typeof EAnimalSpecies];

export const AVG_HANGING_WEIGHTS: Record<EAnimalSpecies, number> = {
  beef: 700,
  hog: 200,
  bison: 600,
  lamb: 50,
  goat: 40,
  venison: 100,
  yak: 600,
  veal: 200,
};

export const SPECIES_EMOJIS: Record<EAnimalSpecies, string> = {
  beef: "🐄",
  hog: "🐷",
  bison: "🦬",
  lamb: "🐑",
  goat: "🐐",
  venison: "🦌",
  yak: "🐃",
  veal: "🐮",
};

export interface AnimalData {
  species: EAnimalSpecies;
  totalHangingWeight: number;
  avgHangingWeight: number;
}
