import { useState } from "react";
import type { SelectChangeEvent } from "@mui/material";

import SpeciesSelect from "./SpeciesSelect";
import SpeciesCard from "./SpeciesCard";
import AdvancedSettings from "./AdvancedSettings";
import SpeciesPresets from "./SpeciesPresets";

import type { EAnimalSpecies, PresetConfig, Scenario } from "./../types";
import { MAX_VOLUME_LBS } from "./../types";

interface ScenarioPanelProps {
  scenario: Scenario;
  onSpeciesChange: (species: EAnimalSpecies[]) => void;
  onVolumeChange: (species: EAnimalSpecies, value: string) => void;
  onRemoveSpecies: (species: EAnimalSpecies) => void;
  onTimeChange: (value: string) => void;
  onWageChange: (value: string) => void;
  onClearAll: () => void;
  stepOffset?: number;
}

export default function ScenarioPanel({
  scenario,
  onSpeciesChange,
  onVolumeChange,
  onRemoveSpecies,
  onTimeChange,
  onWageChange,
  onClearAll,
  stepOffset = 0,
}: ScenarioPanelProps) {
  const [selectOpen, setSelectOpen] = useState(false);

  const { selectedSpecies, volumes, timePerAnimal, hourlyWage } = scenario;

  const handleSpeciesChange = (event: SelectChangeEvent<EAnimalSpecies[]>) => {
    const value = event.target.value;
    const next = typeof value === "string" ? (value.split(",") as EAnimalSpecies[]) : value;
    onSpeciesChange(next);
    setSelectOpen(false);
  };

  const handleVolumeChange = (species: EAnimalSpecies, raw: string) => {
    const numeric = raw.replace(/\D/g, "");
    const clamped =
      numeric === "" ? "" : String(Math.min(Number(numeric), MAX_VOLUME_LBS));
    onVolumeChange(species, clamped);
  };

  const handleApplyPreset = (preset: PresetConfig) => {
    onSpeciesChange(preset.species);
    for (const [sp, vol] of Object.entries(preset.volumes)) {
      onVolumeChange(sp as EAnimalSpecies, vol ?? "");
    }
    setSelectOpen(false);
  };

  return (
    <div>
      <SpeciesPresets onApply={handleApplyPreset} />

      <SpeciesSelect
        selectedSpecies={selectedSpecies}
        selectOpen={selectOpen}
        onOpen={() => setSelectOpen(true)}
        onClose={() => setSelectOpen(false)}
        onChange={handleSpeciesChange}
        onRemove={onRemoveSpecies}
        onClear={onClearAll}
        stepNumber={1 + stepOffset}
      />

      {selectedSpecies.length > 0 && (
        <SpeciesCard
          selectedSpecies={selectedSpecies}
          volumes={volumes}
          onVolumeChange={handleVolumeChange}
          onRemove={onRemoveSpecies}
          stepNumber={2 + stepOffset}
        />
      )}

      <AdvancedSettings
        timePerAnimal={timePerAnimal}
        hourlyWage={hourlyWage}
        onTimeChange={onTimeChange}
        onWageChange={onWageChange}
      />
    </div>
  );
}
