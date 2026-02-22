import { useState, useEffect, useRef } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { useLocalStorage } from "./hooks/useLocalStorage";

import farmshareTheme from "./theme";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScenarioPanel from "./components/ScenarioPanel";
import AnnualSummary from "./components/AnnualSummary";
import SummaryPreview from "./components/SummaryPreview";

import type { EAnimalSpecies, Scenario } from "./types";
import { AVG_HANGING_WEIGHTS, DEFAULT_SCENARIO } from "./types";
import { calculateHeads, calculateLaborValue } from "./utils/calculations";
import "./App.css";

const COST_PER_LB = 0.02;

function App() {
  const [scenario, setScenario] = useLocalStorage<Scenario>("fs_scenario", DEFAULT_SCENARIO);
  const [summaryFullyVisible, setSummaryFullyVisible] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = summaryRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSummaryFullyVisible(entry.isIntersecting),
      { threshold: 1.0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSpeciesChange = (species: EAnimalSpecies[]): void => {
    setScenario((prev) => ({ ...prev, selectedSpecies: species }));
  };

  const handleRemoveSpecies = (species: EAnimalSpecies): void => {
    setScenario((prev) => ({
      ...prev,
      selectedSpecies: prev.selectedSpecies.filter((s) => s !== species),
    }));
  };

  const handleVolumeChange = (species: EAnimalSpecies, value: string): void => {
    setScenario((prev) => ({ ...prev, volumes: { ...prev.volumes, [species]: value } }));
  };

  const handleClear = (): void => {
    setScenario((prev) => ({ ...prev, selectedSpecies: [], volumes: {} }));
  };

  const { selectedSpecies, volumes, timePerAnimal, hourlyWage } = scenario;

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

      <div className="page-wrap">
        <main className="page">
          <header className="page-header">
            <p className="page-header__eyebrow">For Processors</p>
            <h1 className="page-header__title">Meat Processor Value Calculator</h1>
            <p className="page-header__subtitle">
              Estimate your annual labor savings and platform costs based on your
              processing volume. Adjust species, volumes, and labor settings below.
            </p>
          </header>

          <ScenarioPanel
            scenario={scenario}
            onSpeciesChange={handleSpeciesChange}
            onVolumeChange={handleVolumeChange}
            onRemoveSpecies={handleRemoveSpecies}
            onTimeChange={(v) => setScenario((prev) => ({ ...prev, timePerAnimal: v }))}
            onWageChange={(v) => setScenario((prev) => ({ ...prev, hourlyWage: v }))}
            onClearAll={handleClear}
          />

          <div ref={summaryRef}>
            <AnnualSummary
              totalVolume={totalVolume}
              totalSavings={totalSavings}
              totalCost={totalCost}
            />
          </div>
        </main>

        <aside className={`page-sidebar${summaryFullyVisible ? " page-sidebar--absorbed" : ""}`}>
          <SummaryPreview
            totalVolume={totalVolume}
            totalSavings={totalSavings}
            totalCost={totalCost}
          />
        </aside>
      </div>

      <Footer />
    </ThemeProvider>
  );
}

export default App;


