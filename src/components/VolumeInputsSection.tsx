import { Box, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import ScaleOutlinedIcon from "@mui/icons-material/ScaleOutlined";
import type { EAnimalSpecies } from "../types";
import { AVG_HANGING_WEIGHTS } from "../types";

interface VolumeInputsSectionProps {
  selectedSpecies: EAnimalSpecies[];
  volumes: Partial<Record<EAnimalSpecies, string>>;
  volumeErrors: Partial<Record<EAnimalSpecies, string>>;
  maxAnnualVolume: number;
  onVolumeChange: (species: EAnimalSpecies, value: string) => void;
}

export const VolumeInputsSection = ({
  selectedSpecies,
  volumes,
  volumeErrors,
  maxAnnualVolume,
  onVolumeChange,
}: VolumeInputsSectionProps) => {
  if (selectedSpecies.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <ScaleOutlinedIcon color="primary" fontSize="small" />
        <Typography variant="h6">Annual Processing Volume by Species</Typography>
      </Stack>
      {selectedSpecies.map((species) => (
        <Card
          key={species}
          sx={{
            mb: 1.5,
            borderRadius: 2.5,
            border: "1px solid rgba(18,36,43,0.1)",
            boxShadow: "0 6px 14px rgba(11, 21, 32, 0.08)",
            transition: "box-shadow 160ms ease",
            "&:hover": {
              boxShadow: "0 8px 16px rgba(11, 21, 32, 0.11)",
            },
          }}
        >
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 1,
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 650 }}>
                {species.charAt(0).toUpperCase() + species.slice(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "right" }}>
                (Avg: {AVG_HANGING_WEIGHTS[species]} lbs/animal)
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="Total Annual Hanging Weight (lbs)"
              type="number"
              value={volumes[species] || ""}
              onChange={(event) => onVolumeChange(species, event.target.value)}
              inputProps={{ min: 0, max: maxAnnualVolume }}
              error={Boolean(volumeErrors[species])}
              helperText={volumeErrors[species]}
            />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
