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

export interface CalculatorInputs {
  selectedSpecies: EAnimalSpecies[];
  volumes: Partial<Record<EAnimalSpecies, string>>;
  timePerAnimal: string;
  hourlyWage: string;
}

export interface ScenarioSnapshot {
  inputs: CalculatorInputs;
  capturedAt: string;
}

export interface ComparisonState {
  A: ScenarioSnapshot | null;
  B: ScenarioSnapshot | null;
}

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

export interface AnimalData {
  species: EAnimalSpecies;
  totalHangingWeight: number;
  avgHangingWeight: number;
}
