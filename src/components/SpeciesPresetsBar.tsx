import { Box, Chip, Stack, Typography } from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import type { SpeciesPreset } from "../constants/presets";

interface SpeciesPresetsBarProps {
  customPresets: SpeciesPreset[];
  onApplyPreset: (presetId: string) => void;
  onDeleteCustomPreset: (presetId: string) => void;
}

export const SpeciesPresetsBar = ({
  customPresets,
  onApplyPreset,
  onDeleteCustomPreset,
}: SpeciesPresetsBarProps) => {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }}>
        <AutoAwesomeOutlinedIcon color="primary" fontSize="small" />
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
          Species Presets
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {customPresets.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No saved presets yet.
          </Typography>
        ) : null}
        {customPresets.map((preset) => (
          <Chip
            key={preset.id}
            label={preset.label}
            variant="outlined"
            onClick={() => onApplyPreset(preset.id)}
            onDelete={(event) => {
              event.stopPropagation();
              onDeleteCustomPreset(preset.id);
            }}
            sx={{
              borderColor: "rgba(47,122,103,0.4)",
              bgcolor: "rgba(47,122,103,0.08)",
              "& .MuiChip-label": {
                fontWeight: 600,
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};
