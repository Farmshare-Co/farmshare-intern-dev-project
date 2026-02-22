import { describe, expect, it } from "vitest";
import {
  calculatorReducer,
  createInitialCalculatorState,
  isDefaultCalculatorState,
} from "./calculatorReducer";
import { EAnimalSpecies } from "../types";

describe("calculatorReducer preset behavior", () => {
  it("saves, updates, and deletes a custom preset", () => {
    let state = createInitialCalculatorState(null);

    state = calculatorReducer(state, {
      type: "setSelectedSpecies",
      payload: [EAnimalSpecies.beef, EAnimalSpecies.hog],
    });
    state = calculatorReducer(state, {
      type: "setVolume",
      payload: { species: EAnimalSpecies.beef, value: "1000" },
    });
    state = calculatorReducer(state, {
      type: "setVolume",
      payload: { species: EAnimalSpecies.hog, value: "500" },
    });
    state = calculatorReducer(state, {
      type: "saveCustomPreset",
      payload: { id: "custom-1", label: "Processor Mix" },
    });

    expect(state.customPresets).toHaveLength(1);
    expect(state.customPresets[0]).toEqual({
      id: "custom-1",
      label: "Processor Mix",
      species: [EAnimalSpecies.beef, EAnimalSpecies.hog],
      volumes: {
        beef: "1000",
        hog: "500",
      },
    });

    state = calculatorReducer(state, {
      type: "setSelectedSpecies",
      payload: [EAnimalSpecies.beef],
    });
    state = calculatorReducer(state, {
      type: "setVolume",
      payload: { species: EAnimalSpecies.beef, value: "2200" },
    });
    state = calculatorReducer(state, {
      type: "saveCustomPreset",
      payload: { id: "custom-1", label: "Processor Mix Updated" },
    });

    expect(state.customPresets).toHaveLength(1);
    expect(state.customPresets[0]).toEqual({
      id: "custom-1",
      label: "Processor Mix Updated",
      species: [EAnimalSpecies.beef],
      volumes: {
        beef: "2200",
      },
    });

    state = calculatorReducer(state, {
      type: "deleteCustomPreset",
      payload: "custom-1",
    });

    expect(state.customPresets).toEqual([]);
  });

  it("clears custom presets on resetDefaults", () => {
    let state = createInitialCalculatorState(null);

    state = calculatorReducer(state, {
      type: "setSelectedSpecies",
      payload: [EAnimalSpecies.venison],
    });
    state = calculatorReducer(state, {
      type: "setVolume",
      payload: { species: EAnimalSpecies.venison, value: "3000" },
    });
    state = calculatorReducer(state, {
      type: "saveCustomPreset",
      payload: { id: "custom-2", label: "Venison Focus" },
    });

    expect(state.customPresets).toHaveLength(1);

    state = calculatorReducer(state, { type: "resetDefaults" });

    expect(state.customPresets).toEqual([]);
    expect(isDefaultCalculatorState(state)).toBe(true);
  });
});
