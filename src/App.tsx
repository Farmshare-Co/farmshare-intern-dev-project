import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import farmshareTheme from "./theme";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SpeciesSelect from "./components/SpeciesSelect";
import SpeciesCard from "./components/SpeciesCard";
import AdvancedSettings from "./components/AdvancedSettings";
import AnnualSummary from "./components/AnnualSummary";
import type { EAnimalSpecies } from "./types";
import { AVG_HANGING_WEIGHTS } from "./types";
import { calculateHeads, calculateLaborValue } from "./utils/calculations";
import "./App.css";

const COST_PER_LB = 0.02;

function App() {
  const [selectedSpecies, setSelectedSpecies] = useState<EAnimalSpecies[]>([]);
  const [volumes, setVolumes] = useState<Partial<Record<EAnimalSpecies, string>>>({});
  const [timePerAnimal, setTimePerAnimal] = useState("45"); // minutes
  const [hourlyWage, setHourlyWage] = useState("25"); // dollars per hour
  const [selectOpen, setSelectOpen] = useState(false);

  const handleSpeciesChange = (event: SelectChangeEvent<EAnimalSpecies[]>) => {
    const value = event.target.value;
    const species = typeof value === "string" ? value.split(",") : value;
    setSelectedSpecies(species as EAnimalSpecies[]);
    setSelectOpen(false);
  };

  const handleRemoveSpecies = (species: EAnimalSpecies): void => {
    setSelectedSpecies((prev) => prev.filter((s) => s !== species));
  };

  const handleVolumeChange = (species: EAnimalSpecies, value: string): void => {
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
      <Navbar />

      <main className="page">
        <header className="page-header">
          <p className="page-header__eyebrow">For Processors</p>
          <h1 className="page-header__title">Meat Processor Value Calculator</h1>
          <p className="page-header__subtitle">
            Estimate your annual labor savings and platform costs based on your
            processing volume. Adjust species, volumes, and labor settings below.
          </p>
        </header>

        <SpeciesSelect
          selectedSpecies={selectedSpecies}
          selectOpen={selectOpen}
          onOpen={() => setSelectOpen(true)}
          onClose={() => setSelectOpen(false)}
          onChange={handleSpeciesChange}
          onRemove={handleRemoveSpecies}
        />

        {selectedSpecies.length > 0 && (
          <SpeciesCard
            selectedSpecies={selectedSpecies}
            volumes={volumes}
            onVolumeChange={handleVolumeChange}
            onRemove={handleRemoveSpecies}
          />
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

        <Footer/>
    </ThemeProvider>
  );
}

export default App;

