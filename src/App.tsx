import { useState, useEffect, useRef } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { useLocalStorage } from "./hooks/useLocalStorage";

import farmshareTheme from "./theme";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScenarioPanel from "./components/ScenarioPanel";
import AnnualSummary from "./components/AnnualSummary";
import SummaryPreview from "./components/SummaryPreview";

import type { Scenario, ScenarioKey, KeyedSpeciesChangeHandler, KeyedRemoveSpeciesHandler, KeyedVolumeChangeHandler, KeyedClearHandler } from "./types";
import { AVG_HANGING_WEIGHTS, DEFAULT_SCENARIO, SCENARIO_A, SCENARIO_B } from "./types";
import { calculateHeads, calculateLaborValue } from "./utils/calculations";
import "./App.css";

const COST_PER_LB = 0.02;

function App() {
  const [scenarioA, setScenarioA] = useLocalStorage<Scenario>(SCENARIO_A.storageKey, DEFAULT_SCENARIO);
  const [scenarioB, setScenarioB] = useLocalStorage<Scenario>(SCENARIO_B.storageKey, DEFAULT_SCENARIO);
  const [summaryFullyVisible, setSummaryFullyVisible] = useState(false);
  const [scenarioBVisible, setScenarioBVisible] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const scenarioBRef = useRef<HTMLDivElement>(null);

  const [comparisonMode, setComparisonMode] = useLocalStorage<boolean>(
    "comparison",
    false,
  );

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

  useEffect(() => {
    const el = scenarioBRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScenarioBVisible(entry.intersectionRatio >= 0.3),
      { threshold: [0, 0.3] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [comparisonMode]);

  const getScenarioSetter = (which: ScenarioKey) =>
    which === SCENARIO_A ? setScenarioA : setScenarioB;

  const handleSpeciesChange: KeyedSpeciesChangeHandler = (which, species) => {
    getScenarioSetter(which)((prev) => ({ ...prev, selectedSpecies: species }));
  };

  const handleRemoveSpecies: KeyedRemoveSpeciesHandler = (which, species) => {
    getScenarioSetter(which)((prev) => ({
      ...prev,
      selectedSpecies: prev.selectedSpecies.filter((s) => s !== species),
    }));
  };

  const handleVolumeChange: KeyedVolumeChangeHandler = (which, species, value) => {
    getScenarioSetter(which)((prev) => ({ ...prev, volumes: { ...prev.volumes, [species]: value } }));
  };

  const handleClear: KeyedClearHandler = (which) => {
    getScenarioSetter(which)((prev) => ({ ...prev, selectedSpecies: [], volumes: {} }));
  };

  const computeTotals = (scenario: Scenario) => {
    const savings = scenario.selectedSpecies.reduce((acc, species) => {
      const vol = parseFloat(scenario.volumes[species] || "0");
      if (vol <= 0) return acc;
      const heads = calculateHeads(vol, AVG_HANGING_WEIGHTS[species]);
      return acc + calculateLaborValue(heads, parseFloat(scenario.timePerAnimal), parseFloat(scenario.hourlyWage));
    }, 0);
    const cost = scenario.selectedSpecies.reduce(
      (acc, species) => acc + parseFloat(scenario.volumes[species] || "0") * COST_PER_LB,
      0,
    );
    const volume = scenario.selectedSpecies.reduce(
      (acc, species) => acc + parseFloat(scenario.volumes[species] || "0"),
      0,
    );
    return { savings, cost, volume };
  };

  const { savings: totalSavings, cost: totalCost, volume: totalVolume } = computeTotals(scenarioA);
  const { savings: totalSavingsB, cost: totalCostB, volume: totalVolumeB } = computeTotals(scenarioB);

  return (
    <ThemeProvider theme={farmshareTheme}>
      <CssBaseline />
      <Navbar
        comparisonMode={comparisonMode}
        setComparisonMode={setComparisonMode}
      />

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
            label={comparisonMode ? SCENARIO_A.label : undefined}
            scenario={scenarioA}
            onSpeciesChange={(s) => handleSpeciesChange(SCENARIO_A, s)}
            onVolumeChange={(sp, v) => handleVolumeChange(SCENARIO_A, sp, v)}
            onRemoveSpecies={(sp) => handleRemoveSpecies(SCENARIO_A, sp)}
            onTimeChange={(v) => setScenarioA((prev) => ({ ...prev, timePerAnimal: v }))}
            onWageChange={(v) => setScenarioA((prev) => ({ ...prev, hourlyWage: v }))}
            onClearAll={() => handleClear(SCENARIO_A)}
          />

          {comparisonMode && (
            <>
              {/* <div className="scenario-divider">
                <span>{SCENARIO_B.label}</span>
              </div> */}

              <div ref={scenarioBRef}>
                <ScenarioPanel
                  label={SCENARIO_B.label}
                  scenario={scenarioB}
                  onSpeciesChange={(s) => handleSpeciesChange(SCENARIO_B, s)}
                  onVolumeChange={(sp, v) => handleVolumeChange(SCENARIO_B, sp, v)}
                  onRemoveSpecies={(sp) => handleRemoveSpecies(SCENARIO_B, sp)}
                  onTimeChange={(v) => setScenarioB((prev) => ({ ...prev, timePerAnimal: v }))}
                  onWageChange={(v) => setScenarioB((prev) => ({ ...prev, hourlyWage: v }))}
                  onClearAll={() => handleClear(SCENARIO_B)}
                />
              </div>
            </>
          )}

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
            label={comparisonMode && scenarioBVisible ? SCENARIO_B.label : SCENARIO_A.label}
            totalVolume={comparisonMode && scenarioBVisible ? totalVolumeB : totalVolume}
            totalSavings={comparisonMode && scenarioBVisible ? totalSavingsB : totalSavings}
            totalCost={comparisonMode && scenarioBVisible ? totalCostB : totalCost}
          />
        </aside>
      </div>

      <Footer />
    </ThemeProvider>
  );
}

export default App;