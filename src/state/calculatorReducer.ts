import {
  DEFAULT_HOURLY_WAGE,
  DEFAULT_TIME_PER_ANIMAL_MINUTES,
} from "../constants/calculator";
import type { SpeciesPreset } from "../constants/presets";
import type {
  CalculatorInputs,
  ComparisonState,
  EAnimalSpecies,
} from "../types";
import type { PersistedCalculatorState } from "../utils/storage";

export type ScenarioSlot = keyof ComparisonState;
export type CalculatorState = PersistedCalculatorState;

export type CalculatorAction =
  | { type: "setSelectedSpecies"; payload: EAnimalSpecies[] }
  | { type: "setVolume"; payload: { species: EAnimalSpecies; value: string } }
  | { type: "removeSpecies"; payload: EAnimalSpecies }
  | { type: "applyPreset"; payload: SpeciesPreset }
  | { type: "saveCustomPreset"; payload: { id: string; label: string } }
  | { type: "deleteCustomPreset"; payload: string }
  | { type: "setShowAdvanced"; payload: boolean }
  | { type: "setTimePerAnimal"; payload: string }
  | { type: "setHourlyWage"; payload: string }
  | { type: "saveScenario"; payload: { slot: ScenarioSlot; capturedAt: string } }
  | { type: "clearScenario"; payload: ScenarioSlot }
  | { type: "resetDefaults" };

const cloneInputs = (inputs: CalculatorInputs): CalculatorInputs => ({
  selectedSpecies: [...inputs.selectedSpecies],
  volumes: { ...inputs.volumes },
  timePerAnimal: inputs.timePerAnimal,
  hourlyWage: inputs.hourlyWage,
});

const cloneComparison = (comparison: ComparisonState): ComparisonState => ({
  A: comparison.A
    ? {
        capturedAt: comparison.A.capturedAt,
        inputs: cloneInputs(comparison.A.inputs),
      }
    : null,
  B: comparison.B
    ? {
        capturedAt: comparison.B.capturedAt,
        inputs: cloneInputs(comparison.B.inputs),
      }
    : null,
});

const createDefaultState = (): CalculatorState => ({
  selectedSpecies: [],
  volumes: {},
  timePerAnimal: DEFAULT_TIME_PER_ANIMAL_MINUTES,
  hourlyWage: DEFAULT_HOURLY_WAGE,
  showAdvanced: false,
  comparison: { A: null, B: null },
  customPresets: [],
});

export const createInitialCalculatorState = (
  persistedState: PersistedCalculatorState | null,
): CalculatorState => {
  if (!persistedState) {
    return createDefaultState();
  }

  return {
    selectedSpecies: [...persistedState.selectedSpecies],
    volumes: { ...persistedState.volumes },
    timePerAnimal: persistedState.timePerAnimal,
    hourlyWage: persistedState.hourlyWage,
    showAdvanced: persistedState.showAdvanced,
    comparison: cloneComparison(persistedState.comparison),
    customPresets: persistedState.customPresets.map((preset) => ({
      ...preset,
      species: [...preset.species],
      volumes: { ...preset.volumes },
    })),
  };
};

export const isDefaultCalculatorState = (state: CalculatorState): boolean =>
  state.selectedSpecies.length === 0 &&
  Object.keys(state.volumes).length === 0 &&
  state.timePerAnimal === DEFAULT_TIME_PER_ANIMAL_MINUTES &&
  state.hourlyWage === DEFAULT_HOURLY_WAGE &&
  !state.showAdvanced &&
  state.comparison.A === null &&
  state.comparison.B === null &&
  state.customPresets.length === 0;

export const calculatorReducer = (
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState => {
  switch (action.type) {
    case "setSelectedSpecies":
      return {
        ...state,
        selectedSpecies: [...action.payload],
      };
    case "setVolume":
      return {
        ...state,
        volumes: {
          ...state.volumes,
          [action.payload.species]: action.payload.value,
        },
      };
    case "removeSpecies": {
      const nextVolumes = { ...state.volumes };
      delete nextVolumes[action.payload];

      return {
        ...state,
        selectedSpecies: state.selectedSpecies.filter(
          (species) => species !== action.payload,
        ),
        volumes: nextVolumes,
      };
    }
    case "applyPreset":
      return {
        ...state,
        selectedSpecies: [...action.payload.species],
        volumes: { ...action.payload.volumes },
      };
    case "saveCustomPreset": {
      if (state.selectedSpecies.length === 0) {
        return state;
      }

      const volumes = state.selectedSpecies.reduce<CalculatorState["volumes"]>(
        (acc, species) => {
          const value = state.volumes[species];
          if (typeof value === "string") {
            acc[species] = value;
          }
          return acc;
        },
        {},
      );

      const nextPreset: SpeciesPreset = {
        id: action.payload.id,
        label: action.payload.label,
        species: [...state.selectedSpecies],
        volumes,
      };

      return {
        ...state,
        customPresets: [
          ...state.customPresets.filter((preset) => preset.id !== action.payload.id),
          nextPreset,
        ],
      };
    }
    case "deleteCustomPreset":
      return {
        ...state,
        customPresets: state.customPresets.filter(
          (preset) => preset.id !== action.payload,
        ),
      };
    case "setShowAdvanced":
      return {
        ...state,
        showAdvanced: action.payload,
      };
    case "setTimePerAnimal":
      return {
        ...state,
        timePerAnimal: action.payload,
      };
    case "setHourlyWage":
      return {
        ...state,
        hourlyWage: action.payload,
      };
    case "saveScenario": {
      const snapshotInputs = cloneInputs({
        selectedSpecies: state.selectedSpecies,
        volumes: state.volumes,
        timePerAnimal: state.timePerAnimal,
        hourlyWage: state.hourlyWage,
      });

      return {
        ...state,
        comparison: {
          ...state.comparison,
          [action.payload.slot]: {
            inputs: snapshotInputs,
            capturedAt: action.payload.capturedAt,
          },
        },
      };
    }
    case "clearScenario":
      return {
        ...state,
        comparison: {
          ...state.comparison,
          [action.payload]: null,
        },
      };
    case "resetDefaults":
      return createDefaultState();
    default:
      return state;
  }
};
