import { TextField } from "@mui/material";
import type { EAnimalSpecies } from "../types";
import { AVG_HANGING_WEIGHTS } from "../types";
import { calculateHeads } from "../utils/calculations";

interface SpeciesCardProps {
    species: EAnimalSpecies;
    volume: string;
    onVolumeChange: (value: string) => void;
}


export default function SpeciesCard({
    species,
    volume,
    onVolumeChange,
}: SpeciesCardProps) {
    const avgWeight = AVG_HANGING_WEIGHTS[species];
    const vol = parseFloat(volume || "0");
    const heads = vol > 0 ? calculateHeads(vol, avgWeight) : null;

    return (
        <div className="species-card">
            <p className="species-card__name">{species.toUpperCase()}</p>
            <p className="species-card__meta"> Avg hanging weight: {avgWeight} lbs / animal </p>

            <TextField
                fullWidth
                label="Total Annual Hanging Weight (lbs)"
                type="number"
                value={volume}
                onChange={(e) => onVolumeChange(e.target.value)}
                slotProps={{ htmlInput: { min: 0 } }}
                size="small"
            />
            {heads !== null && (
                <span className="fs-species-card__heads">
                    ≈ {heads.toLocaleString()} head / year
                </span>
            )}
        </div>
    )
}