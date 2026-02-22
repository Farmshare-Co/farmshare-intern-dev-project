import { EAnimalSpecies } from "../types";
import type { SpeciesPreset } from "../constants/presets";
import type {
  CalculatorInputs,
  ComparisonState,
  EAnimalSpecies as AnimalSpecies,
  ScenarioSnapshot,
} from "../types";

const STORAGE_KEY = "farmshare-calculator-state";
const STORAGE_VERSION = 2;

const VALID_SPECIES = new Set<string>(Object.values(EAnimalSpecies));
const DEFAULT_COMPARISON_STATE: ComparisonState = {
  A: null,
  B: null,
};

export interface PersistedCalculatorState {
  selectedSpecies: CalculatorInputs["selectedSpecies"];
  volumes: CalculatorInputs["volumes"];
  timePerAnimal: CalculatorInputs["timePerAnimal"];
  hourlyWage: CalculatorInputs["hourlyWage"];
  showAdvanced: boolean;
  comparison: ComparisonState;
  customPresets: SpeciesPreset[];
}

interface PersistedPayload {
  version: number;
  state: PersistedCalculatorState;
}

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const sanitizeSpecies = (value: unknown): AnimalSpecies[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (species): species is AnimalSpecies =>
      typeof species === "string" && VALID_SPECIES.has(species),
  );
};

const sanitizeVolumes = (
  value: unknown,
): Partial<Record<AnimalSpecies, string>> => {
  if (!isObjectRecord(value)) {
    return {};
  }

  const entries = Object.entries(value).filter(
    ([species, rawVolume]) =>
      VALID_SPECIES.has(species) && typeof rawVolume === "string",
  );

  return Object.fromEntries(entries) as Partial<Record<AnimalSpecies, string>>;
};

const sanitizeInputs = (value: unknown): CalculatorInputs | null => {
  if (!isObjectRecord(value)) {
    return null;
  }

  if (typeof value.timePerAnimal !== "string") {
    return null;
  }

  if (typeof value.hourlyWage !== "string") {
    return null;
  }

  return {
    selectedSpecies: sanitizeSpecies(value.selectedSpecies),
    volumes: sanitizeVolumes(value.volumes),
    timePerAnimal: value.timePerAnimal,
    hourlyWage: value.hourlyWage,
  };
};

const sanitizeScenarioSnapshot = (value: unknown): ScenarioSnapshot | null => {
  if (!isObjectRecord(value)) {
    return null;
  }

  if (typeof value.capturedAt !== "string") {
    return null;
  }

  const inputs = sanitizeInputs(value.inputs);
  if (!inputs) {
    return null;
  }

  return {
    inputs,
    capturedAt: value.capturedAt,
  };
};

const sanitizeComparisonState = (value: unknown): ComparisonState => {
  if (!isObjectRecord(value)) {
    return { ...DEFAULT_COMPARISON_STATE };
  }

  return {
    A: sanitizeScenarioSnapshot(value.A),
    B: sanitizeScenarioSnapshot(value.B),
  };
};

const sanitizePreset = (value: unknown): SpeciesPreset | null => {
  if (!isObjectRecord(value)) {
    return null;
  }

  if (typeof value.id !== "string" || value.id.trim() === "") {
    return null;
  }

  if (typeof value.label !== "string" || value.label.trim() === "") {
    return null;
  }

  return {
    id: value.id,
    label: value.label,
    species: sanitizeSpecies(value.species),
    volumes: sanitizeVolumes(value.volumes),
  };
};

const sanitizeCustomPresets = (value: unknown): SpeciesPreset[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((preset) => sanitizePreset(preset))
    .filter((preset): preset is SpeciesPreset => preset !== null);
};

const sanitizeState = (value: unknown): PersistedCalculatorState | null => {
  if (!isObjectRecord(value)) {
    return null;
  }

  if (typeof value.showAdvanced !== "boolean") {
    return null;
  }

  const inputs = sanitizeInputs(value);
  if (!inputs) {
    return null;
  }

  return {
    selectedSpecies: inputs.selectedSpecies,
    volumes: inputs.volumes,
    timePerAnimal: inputs.timePerAnimal,
    hourlyWage: inputs.hourlyWage,
    showAdvanced: value.showAdvanced,
    comparison: sanitizeComparisonState(value.comparison),
    customPresets: sanitizeCustomPresets(value.customPresets),
  };
};

export const loadPersistedState = (): PersistedCalculatorState | null => {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as unknown;
    if (!isObjectRecord(parsedValue)) {
      return null;
    }

    if (parsedValue.version !== STORAGE_VERSION) {
      return null;
    }

    return sanitizeState(parsedValue.state);
  } catch {
    return null;
  }
};

export const persistState = (state: PersistedCalculatorState): void => {
  const payload: PersistedPayload = {
    version: STORAGE_VERSION,
    state,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const clearPersistedState = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
