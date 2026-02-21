import { TextField, Card, CardContent, Typography} from "@mui/material";
import type { EAnimalSpecies } from "../types";
import { AVG_HANGING_WEIGHTS } from "../types";

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
    return (
        <Card key={species} sx={{ mb: 2 }}>
            <CardContent>
            <Typography variant="subtitle1" gutterBottom>
                {species.charAt(0).toUpperCase() + species.slice(1)}
                <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ ml: 1 }}
                >
                (Avg: {AVG_HANGING_WEIGHTS[species]} lbs/animal)
                </Typography>
            </Typography>
            <TextField
                fullWidth
                label="Total Annual Hanging Weight (lbs)"
                type="number"
                value={volume}
                onChange={(e) =>
                onVolumeChange(e.target.value)
                }
                inputProps={{ min: 0 }}
            />
            </CardContent>
        </Card>
    )
}