import { SPECIES_PRESETS } from "../types";
import type { PresetConfig } from "../types";

interface SpeciesPresetsProps {
  onApply: (preset: PresetConfig) => void;
}

export default function SpeciesPresets({ onApply }: SpeciesPresetsProps) {
  return (
    <div className="presets">
      <span className="presets__label">Quick presets:</span>
      <div className="presets__buttons">
        {Object.entries(SPECIES_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            type="button"
            className="preset-btn"
            onClick={() => onApply(preset)}
            title={preset.description ? `${preset.label} — ${preset.description}` : `Apply ${preset.label} preset`}
          >
            <span className="preset-btn__icon">{preset.icon}</span>
            <span>{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
