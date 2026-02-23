import { useState } from "react";
import type { SelectChangeEvent } from "@mui/material";

import SpeciesSelect from "./SpeciesSelect";
import SpeciesCard from "./SpeciesCard";
import AdvancedSettings from "./AdvancedSettings";
import SpeciesPresets from "./SpeciesPresets";

import type { EAnimalSpecies, PresetConfig, Scenario } from "../utils/types";
import { MAX_VOLUME_LBS } from "../utils/types";
import { useSnackbar } from "../contexts/SnackbarContext";

interface ScenarioPanelProps {
    label?: string;
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
    label,
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

    const { showSnackbar } = useSnackbar();

    const { selectedSpecies, volumes, timePerAnimal, hourlyWage } = scenario;

    const handleSpeciesChange = (event: SelectChangeEvent<EAnimalSpecies[]>) => {
        const value = event.target.value;
        const next = typeof value === "string" ? (value.split(",") as EAnimalSpecies[]) : value;
        onSpeciesChange(next);
        setSelectOpen(false);
    };

    const handleVolumeChange = (species: EAnimalSpecies, raw: string) => {
        const numeric = raw.replace(/\D/g, "");
        const numericVal = numeric === "" ? 0 : Number(numeric);
        const clamped =
            numeric === "" ? "" : String(Math.min(numericVal, MAX_VOLUME_LBS));
        if (numericVal > MAX_VOLUME_LBS) {
            showSnackbar(`Volume capped at ${MAX_VOLUME_LBS.toLocaleString()} lbs maximum`, "warning");
        }
        onVolumeChange(species, clamped);
    };

    const handleApplyPreset = (preset: PresetConfig) => {
        onSpeciesChange(preset.species);
        for (const [sp, vol] of Object.entries(preset.volumes)) {
            onVolumeChange(sp as EAnimalSpecies, vol ?? "");
        }
        setSelectOpen(false);
        showSnackbar(`"${preset.label}" preset applied`, "success");
    };

    const handleClearAll = () => {
        if (selectedSpecies.length === 0) return;
        onClearAll();
        showSnackbar("All species cleared", "info");
    };

    return (
        <div>
            <SpeciesPresets onApply={handleApplyPreset} />

            <SpeciesSelect
                label={label || ""}
                selectedSpecies={selectedSpecies}
                selectOpen={selectOpen}
                onOpen={() => setSelectOpen(true)}
                onClose={() => setSelectOpen(false)}
                onChange={handleSpeciesChange}
                onRemove={onRemoveSpecies}
                onClear={handleClearAll}
                stepNumber={1 + stepOffset}
            />

            {selectedSpecies.length > 0 && (
                <SpeciesCard
                    label={label || ""}
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
