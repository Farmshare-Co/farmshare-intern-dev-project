import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { EAnimalSpecies } from "../utils/types";
import { EAnimalSpecies as AnimalSpecies } from "../utils/types";
import { capitalize } from "../utils/formatters";

interface SpeciesSelectProps {
  label?: string;
  selectedSpecies: EAnimalSpecies[];
  selectOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChange: (event: SelectChangeEvent<EAnimalSpecies[]>) => void;
  onRemove: (species: EAnimalSpecies) => void;
  onClear: () => void;
  stepNumber?: number;
}

export default function SpeciesSelect({
  label,
  selectedSpecies,
  selectOpen,
  onOpen,
  onClose,
  onChange,
  onRemove,
  onClear,
  stepNumber = 1,
}: SpeciesSelectProps) {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p className="card__header-title">Step {stepNumber} — Select Species
          {label && (
            <span
              className="scenario-badge"
            >
              {label}
            </span>
          )}
        </p>

        {selectedSpecies.length > 0 && (
          <button onClick={onClear} className="species-btn__clear">
            Clear all
          </button>
        )}
      </div>
      <div className="card__body">
        <FormControl fullWidth>
          <InputLabel>Animal Species</InputLabel>
          <Select
            multiple
            open={selectOpen}
            onOpen={onOpen}
            onClose={onClose}
            value={selectedSpecies}
            onChange={onChange}
            input={<OutlinedInput label="Select Animal Species" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={capitalize(value)}
                    onDelete={(e) => {
                      e.stopPropagation();
                      onRemove(value);
                    }}
                    deleteIcon={
                      <span
                        role="button"
                        aria-label="remove"
                        onMouseDown={(e) => e.stopPropagation()}
                        className="species-chip__delete"
                      >
                        ×
                      </span>
                    }
                  />
                ))}
              </Box>
            )}
          >
            {Object.values(AnimalSpecies).map((s) => (
              <MenuItem key={s} value={s}>
                {capitalize(s)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedSpecies.length === 0 && (
          <p className="select-hint">
            Select one or more species to begin calculating your value.
          </p>
        )}
      </div>
    </div>
  );
}
