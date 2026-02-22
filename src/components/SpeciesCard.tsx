import { TextField } from "@mui/material";
import type { EAnimalSpecies } from "../types";
import { AVG_HANGING_WEIGHTS } from "../types";
import { calculateHeads } from "../utils/calculations";

interface SpeciesCardProps {
  selectedSpecies: EAnimalSpecies[];
  volumes: Partial<Record<EAnimalSpecies, string>>;
  onVolumeChange: (species: EAnimalSpecies, value: string) => void;
  onRemove: (species: EAnimalSpecies) => void;
}

export default function SpeciesCard({
  selectedSpecies,
  volumes,
  onVolumeChange,
  onRemove,
}: SpeciesCardProps) {
  return (
    <div className="card">
      <div className="card__header">
        <p className="card__header-title">Step 2 — Annual Processing Volume by Species</p>
      </div>
      <div className="card__body">
        <div className="species-grid">
          {selectedSpecies.map((species) => {
            const avgWeight = AVG_HANGING_WEIGHTS[species];
            const vol = parseFloat(volumes[species] || "0");
            const heads = vol > 0 ? calculateHeads(vol, avgWeight) : null;

            return (
              <div key={species} className="species-card" style={{ position: "relative" }}>
                <button
                  onClick={() => onRemove(species)}
                  aria-label={`remove ${species}`}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "none",
                    border: "none",
                    padding: "0 4px",
                    cursor: "pointer",
                    fontSize: 16,
                    lineHeight: 1,
                    color: "var(--fs-text-muted)",
                    borderRadius: 4,
                  }}
                >
                  ×
                </button>
                <p className="species-card__name">{species.toUpperCase()}</p>
                <p className="species-card__meta">Avg hanging weight: {avgWeight} lbs / animal</p>
                <TextField
                  fullWidth
                  label="Total Annual Hanging Weight (lbs)"
                  type="number"
                  value={volumes[species] || ""}
                  onChange={(e) => onVolumeChange(species, e.target.value)}
                  slotProps={{ htmlInput: { min: 0 } }}
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
