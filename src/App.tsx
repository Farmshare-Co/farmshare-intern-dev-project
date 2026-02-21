import { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
  CssBaseline,
  ThemeProvider
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import AnnualSummary from "./components/AnnualSummary"
import AdvancedSettings from "./components/AdvancedSettings";
import SpeciesCard from "./components/SpeciesCard";
import farmshareTheme from "./theme";
import type { EAnimalSpecies } from "./types";
import { EAnimalSpecies as AnimalSpecies, AVG_HANGING_WEIGHTS } from "./types";
import { calculateHeads, calculateLaborValue } from "./utils/calculations";
import "./App.css";

const COST_PER_LB = 0.02;

function App() {
  const [selectedSpecies, setSelectedSpecies] = useState<EAnimalSpecies[]>([]);
  const [volumes, setVolumes] = useState<Record<EAnimalSpecies, string>>(
    {} as Record<EAnimalSpecies, string>,
  );
  const [selectOpen, setSelectOpen] = useState(false);
  const [timePerAnimal, setTimePerAnimal] = useState("45"); // minutes
  const [hourlyWage, setHourlyWage] = useState("25"); // dollars

  const handleSpeciesChange = (event: SelectChangeEvent<EAnimalSpecies[]>) => {
    const value = event.target.value;
    const species = typeof value === "string" ? value.split(",") : value;
    setSelectedSpecies(species as EAnimalSpecies[]);
    setSelectOpen(false);
  };

  const handleRemoveSpecies = (species: EAnimalSpecies): void => {
    setSelectedSpecies((prev) => prev.filter((s) => s !== species));
  };

  const handleVolumeChange = (species: EAnimalSpecies, value: string) => {
    setVolumes((prev) => ({ ...prev, [species]: value }));
  };

  const totalSavings: number = selectedSpecies.reduce((acc, species) => {
    const vol = parseFloat(volumes[species] || "0");
    if (vol <= 0) return acc;
    const heads = calculateHeads(vol, AVG_HANGING_WEIGHTS[species]);
    return acc + calculateLaborValue(heads, parseFloat(timePerAnimal), parseFloat(hourlyWage));
  }, 0);

  const totalCost: number = selectedSpecies.reduce((acc, species) => {
    return acc + parseFloat(volumes[species] || "0") * COST_PER_LB;
  }, 0);

  const totalVolume: number = selectedSpecies.reduce((acc, species) => {
    return acc + parseFloat(volumes[species] || "0");
  }, 0);

  return (
    <ThemeProvider theme={farmshareTheme}>
      <CssBaseline />
      <main className="page">
        <header className="page-header">
          <p className="page-header__eyebrow">For Processors</p>
          <h1 className="page-header__title">Meat Processor Value Calculator</h1>
          <p className="page-header__subtitle">
            Estimate your annual labor savings and platform costs based on your
            processing volume. Adjust species, volumes, and labor settings below.
          </p>
        </header>


        <div className="card">
          <div className="card__header">
            <p className="card__header-title">Step 1 - Select Species</p>
          </div>
          <div className="card-body">
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Animal Species</InputLabel>
              <Select
                multiple
                open={selectOpen}
                onOpen={() => setSelectOpen(true)}
                onClose={() => setSelectOpen(false)}
                value={selectedSpecies}
                onChange={handleSpeciesChange}
                input={<OutlinedInput label="Select Animal Species" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={value.charAt(0).toUpperCase() + value.slice(1)}
                        onDelete={(e) => {
                          e.stopPropagation();
                          handleRemoveSpecies(value);
                        }}
                        deleteIcon={
                          <span
                            role="button"
                            aria-label="remove"
                            onMouseDown={(e) => e.stopPropagation()}
                            style={{
                              cursor: "pointer",
                              marginLeft: 2,
                              marginRight: 4,
                              fontSize: "15px",
                              color: "#3A7D5E",
                              lineHeight: 1,
                            }}
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
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {selectedSpecies.length > 0 && (
          <div className="card">
            <div className="card__header">
              <p className="card__header-title"> Step 2 - Annual Processing Volume by Species</p>
            </div>
            <div className="card__body">
              <div className="species-grid">
                {selectedSpecies.map((species) => (
                  <SpeciesCard
                    key={species}
                    species={species}
                    volume={volumes[species] || ""}
                    onVolumeChange={(val) => handleVolumeChange(species, val)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <AdvancedSettings
          timePerAnimal={timePerAnimal}
          hourlyWage={hourlyWage}
          onTimeChange={setTimePerAnimal}
          onWageChange={setHourlyWage}
        />

        <AnnualSummary
          totalVolume={totalVolume}
          totalSavings={totalSavings}
          totalCost={totalCost}
        />

      </main>

    </ThemeProvider>
  );
}

export default App;
