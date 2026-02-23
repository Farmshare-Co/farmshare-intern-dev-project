import { useState, useEffect, useRef } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { SnackbarProvider, useSnackbar } from "./contexts/SnackbarContext";

import farmshareTheme from "./utils/theme";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScenarioPanel from "./components/ScenarioPanel";
import AnnualSummary from "./components/AnnualSummary";
import SummaryPreview from "./components/SummaryPreview";

import type { Scenario, ScenarioKey, KeyedSpeciesChangeHandler, KeyedRemoveSpeciesHandler, KeyedVolumeChangeHandler, KeyedClearHandler, BreakdownRow } from "./utils/types";
import { AVG_HANGING_WEIGHTS, DEFAULT_SCENARIO, SCENARIO_A, SCENARIO_B } from "./utils/types";
import { calculateHeads, calculateLaborValue } from "./utils/calculations";

import "./styles/App.css";
import "./styles/navbar.css";
import "./styles/card.css";
import "./styles/species.css";
import "./styles/summary.css";
import "./styles/advanced.css";
import "./styles/presets.css";
import "./styles/footer.css";
import "./styles/responsive.css";

const COST_PER_LB = 0.02;

function AppContent() {
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

  const { showSnackbar } = useSnackbar();

  const handleComparisonToggle = (value: boolean) => {
    setComparisonMode(value);
    showSnackbar(
      value ? "Comparison mode enabled" : "Comparison mode disabled",
      "info",
    );
  };

  useEffect(() => {
    const el = summaryRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSummaryFullyVisible(entry.intersectionRatio >= 0.5),
      { threshold: [0, 0.5] },
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

  const computeTotals = (scenario: Scenario): { savings: number; cost: number; volume: number; breakdown: BreakdownRow[] } => {
    const breakdown: BreakdownRow[] = [];
    let savings = 0;
    let cost = 0;
    let volume = 0;
    for (const species of scenario.selectedSpecies) {
      const vol = parseFloat(scenario.volumes[species] || "0");
      if (vol <= 0) continue;
      const heads = calculateHeads(vol, AVG_HANGING_WEIGHTS[species]);
      const spSavings = calculateLaborValue(heads, parseFloat(scenario.timePerAnimal), parseFloat(scenario.hourlyWage));
      const spCost = vol * COST_PER_LB;
      savings += spSavings;
      cost += spCost;
      volume += vol;
      breakdown.push({ species, volume: vol, heads, savings: spSavings, cost: spCost });
    }
    return { savings, cost, volume, breakdown };
  };

  const { savings: totalSavings, cost: totalCost, volume: totalVolume, breakdown } = computeTotals(scenarioA);
  const { savings: totalSavingsB, cost: totalCostB, volume: totalVolumeB, breakdown: breakdownB } = computeTotals(scenarioB);

  return (
    <>
      <Navbar
        comparisonMode={comparisonMode}
        setComparisonMode={handleComparisonToggle}
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
                  stepOffset={2}
                />
              </div>
            </>
          )}

          <div ref={summaryRef}>
            <AnnualSummary
              totalVolume={totalVolume}
              totalSavings={totalSavings}
              totalCost={totalCost}
              breakdown={breakdown}
              comparisonMode={comparisonMode}
              totalVolumeB={totalVolumeB}
              totalSavingsB={totalSavingsB}
              totalCostB={totalCostB}
              breakdownB={breakdownB}
              labelA={SCENARIO_A.label}
              labelB={SCENARIO_B.label}
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
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={farmshareTheme}>
      <CssBaseline />
      <SnackbarProvider>
        <AppContent />
      </SnackbarProvider>
    </ThemeProvider>
  );
}