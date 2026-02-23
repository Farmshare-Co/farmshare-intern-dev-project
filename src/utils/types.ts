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

export interface AnimalData {
  species: EAnimalSpecies;
  totalHangingWeight: number;
  avgHangingWeight: number;
}


export interface Scenario {
  selectedSpecies: EAnimalSpecies[];
  volumes: Partial<Record<EAnimalSpecies, string>>;
  timePerAnimal: string;
  hourlyWage: string;
}

export const DEFAULT_SCENARIO: Scenario = {
  selectedSpecies: [],
  volumes: {},
  timePerAnimal: "45",
  hourlyWage: "25",
};

export const MAX_VOLUME_LBS = 10_000_000;

export interface BreakdownRow {
  species: EAnimalSpecies;
  volume: number;
  heads: number;
  savings: number;
  cost: number;
}

export const SCENARIO_A = { storageKey: "fs_scenario", label: "Scenario A" } as const;
export const SCENARIO_B = { storageKey: "fs_scenarioB", label: "Scenario B" } as const;

export type ScenarioKey = typeof SCENARIO_A | typeof SCENARIO_B;

export type KeyedSpeciesChangeHandler = (which: ScenarioKey, species: EAnimalSpecies[]) => void;
export type KeyedRemoveSpeciesHandler = (which: ScenarioKey, species: EAnimalSpecies) => void;
export type KeyedVolumeChangeHandler = (which: ScenarioKey, species: EAnimalSpecies, value: string) => void;
export type KeyedClearHandler = (which: ScenarioKey) => void;

export interface PresetConfig {
  label: string;
  icon: string;
  description?: string;
  species: EAnimalSpecies[];
  volumes: Partial<Record<EAnimalSpecies, string>>;
}

export const SPECIES_PRESETS: Record<string, PresetConfig> = {
  beefFocused: {
    label: "Beef-Focused",
    icon: "🐄",
    description: "Main beef bison/yak",
    species: ["beef", "bison", "yak", "veal"],
    volumes: { beef: "120000", bison: "20000", yak: "12000", veal: "8000" }, // total: 160k
  },

  largeBeefPlant: {
    label: "Large Beef Plant",
    icon: "🐮🐄",
    description: "High-throughput beef",
    species: ["beef", "veal"],
    volumes: { beef: "750000", veal: "75000" }, // total: 825k
  },

  mixed: {
    label: "Mixed",
    icon: "🐒",
    description: "Broad species mix",
    species: ["beef", "hog", "lamb", "goat", "venison"],
    volumes: { beef: "80000", hog: "50000", lamb: "12000", goat: "8000", venison: "15000" }, // total: 165k
  },

  porkFocused: {
    label: "Hog-Focused",
    icon: "🐖",
    description: "Primarily hog processing",
    species: ["hog"],
    volumes: { hog: "150000" },
  },

  highVolumeHog: {
    label: "High Volume Hog",
    icon: "🐷🐖",
    description: "Large hog",
    species: ["hog"],
    volumes: { hog: "600000" },
  },

  smallFarm: {
    label: "Small Farm / CSA",
    icon: "🌱",
    description: "Ruminants + occasional hog",
    species: ["lamb", "goat", "hog"],
    volumes: { lamb: "6000", goat: "4500", hog: "12000" }, // total: 22.5k
  },

  wildGame: {
    label: "Wild Game",
    icon: "🦌",
    description: "Seasonal wild game",
    species: ["venison", "yak", "bison"],
    volumes: { venison: "35000", yak: "8000", bison: "7000" }, // total: 50k
  },

  exoticsAndBison: {
    label: "Exotics",
    icon: "🦬",
    description: "Bison/yak with some beef",
    species: ["bison", "yak", "beef"],
    volumes: { bison: "45000", yak: "25000", beef: "30000" }, // total: 100k
  },

  customStarter: {
    label: "Demo",
    icon: "🏔️",
    description: "Defaults",
    species: ["beef", "hog"],
    volumes: { beef: "25000", hog: "15000" }, // total: 40k
  },
};