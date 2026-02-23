import { TextField } from "@mui/material";
import type { EAnimalSpecies } from "../types";
import { AVG_HANGING_WEIGHTS } from "../types";
import { calculateHeads } from "../utils/calculations";
import { capitalize } from "../utils/formatters";

interface SpeciesCardProps {
  label: string;
  selectedSpecies: EAnimalSpecies[];
  volumes: Partial<Record<EAnimalSpecies, string>>;
  onVolumeChange: (species: EAnimalSpecies, value: string) => void;
  onRemove: (species: EAnimalSpecies) => void;
  stepNumber?: number;
}

export default function SpeciesCard({
  label,
  selectedSpecies,
  volumes,
  onVolumeChange,
  onRemove,
  stepNumber = 2,
}: SpeciesCardProps) {
  return (
    <div className="card">
      <div className="card__header">
        <p className="card__header-title">Step {stepNumber} — Annual Processing Volume by Species
          {label && (
            <span
              className="scenario-badge"
            >
              {label}
            </span>
          )}
        </p>
      </div>
      <div className="card__body">
        <div className="species-grid">
          {selectedSpecies.map((species) => {
            const avgWeight = AVG_HANGING_WEIGHTS[species];
            const vol = parseFloat(volumes[species] || "0");
            const heads = vol > 0 ? calculateHeads(vol, avgWeight) : null;

            return (
              <div key={species} className="species-card">
                <button
                  onClick={() => onRemove(species)}
                  aria-label={`remove ${species}`}
                  className="species-btn__remove"
                >
                  ×
                </button>
                <p className="species-card__name">{capitalize(species)}</p>
                <p className="species-card__meta">Avg hanging weight: {avgWeight} lbs / animal</p>
                <TextField
                  fullWidth
                  label="Total Annual Hanging Weight (lbs)"
                  type="text"
                  value={volumes[species] || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    onVolumeChange(species, value);
                  }}
                  slotProps={{
                    htmlInput: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    },
                  }}
                  size="small"
                />
                {heads !== null && (
                  <span className="species-card__heads">
                    {heads >= 1 ? `≈ ${heads.toLocaleString()} heads / year` : "< 1 head / year"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
