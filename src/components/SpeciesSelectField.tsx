import {
  Box,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import type { EAnimalSpecies } from "../types";
import { EAnimalSpecies as AnimalSpecies } from "../types";

interface SpeciesSelectFieldProps {
  selectedSpecies: EAnimalSpecies[];
  isSpeciesMenuOpen: boolean;
  onSpeciesChange: (event: SelectChangeEvent<EAnimalSpecies[]>) => void;
  onSpeciesMenuOpen: () => void;
  onSpeciesMenuClose: () => void;
  onSpeciesRemove: (species: EAnimalSpecies) => void;
}

export const SpeciesSelectField = ({
  selectedSpecies,
  isSpeciesMenuOpen,
  onSpeciesChange,
  onSpeciesMenuOpen,
  onSpeciesMenuClose,
  onSpeciesRemove,
}: SpeciesSelectFieldProps) => {
  return (
    <FormControl
      fullWidth
      sx={{
        mb: 3,
        "& .MuiChip-root": {
          bgcolor: "rgba(47,122,103,0.12)",
          border: "1px solid rgba(47,122,103,0.24)",
        },
      }}
    >
      <InputLabel>Select Animal Species</InputLabel>
      <Select
        multiple
        value={selectedSpecies}
        onChange={onSpeciesChange}
        open={isSpeciesMenuOpen}
        onOpen={onSpeciesMenuOpen}
        onClose={onSpeciesMenuClose}
        input={
          <OutlinedInput
            label="Select Animal Species"
            startAdornment={
              <InputAdornment position="start">
                <PetsOutlinedIcon
                  fontSize="small"
                  sx={{ color: "primary.main", opacity: 0.8 }}
                />
              </InputAdornment>
            }
          />
        }
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={value.charAt(0).toUpperCase() + value.slice(1)}
                aria-label={`remove ${value}`}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => onSpeciesRemove(value)}
                onDelete={() => onSpeciesRemove(value)}
              />
            ))}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: 2,
              border: "1px solid rgba(18,36,43,0.16)",
              boxShadow: "0 14px 24px rgba(10,18,24,0.22)",
            },
          },
        }}
      >
        {Object.values(AnimalSpecies).map((species) => (
          <MenuItem
            key={species}
            value={species}
            sx={{
              py: 1,
              "&.Mui-selected": {
                bgcolor: "rgba(47,122,103,0.16)",
              },
            }}
          >
            {species.charAt(0).toUpperCase() + species.slice(1)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
